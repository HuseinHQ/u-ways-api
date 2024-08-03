const db = require('../config/firestoreDatabase');
const { comparePassword } = require('../helpers/bcrypt');
const checkEmailAndRole = require('../helpers/checkEmailAndRole');
const { createAccessToken, createRefreshToken, verifyToken } = require('../helpers/jwt');
const { User, Student, Lecturer, sequelize, Major, Faculty, Chat } = require('../models/index');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password, confirm_password } = req.body;

      if (password !== confirm_password) {
        throw {
          name: 'ValidationError',
          errors: {
            confirm_password: ['PASSWORD_NOT_MATCH'],
          },
        };
      }

      const role = checkEmailAndRole(email);
      if (!role) {
        throw {
          name: 'ValidationError',
          errors: {
            email: ['INVALID'],
          },
        };
      }

      await User.create({ name, email, password, confirm_password, role });

      const loginReq = {
        body: {
          email,
          password,
          fromRegister: true,
        },
      };
      await UserController.login(loginReq, res, next);
    } catch (err) {
      console.log('----- controllers/UserController.js (register) -----\n', err);
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password, fromRegister } = req.body;

      const findUser = await User.findOne({ where: { email } });
      if (!findUser) throw { name: 'AuthError' };

      const isPasswordValid = comparePassword(password, findUser.password);
      if (!isPasswordValid) throw { name: 'AuthError' };

      const payload = { id: findUser.id, role: findUser.role };
      const isBioComplete = findUser.isComplete;
      const access_token = createAccessToken(payload);
      const refresh_token = createRefreshToken(payload);
      const role = findUser.role;

      res.status(fromRegister ? 201 : 200).json({ data: { access_token, refresh_token, isBioComplete, role } });
    } catch (err) {
      console.log('----- controllers/UserController.js (login) -----\n', err);
      next(err);
    }
  }

  static async completeData(req, res, next) {
    try {
      const { id, role } = req.user;
      const { MajorId, LecturerId, semester, nip } = req.body;

      const findUser = await User.findByPk(id);
      if (findUser.isComplete) throw { name: 'DataComplete' };

      let findLecturer;
      if (role === 'mahasiswa') {
        findLecturer = await Lecturer.findByPk(LecturerId, { include: [User] });
      }

      if (role === 'mahasiswa') {
        const npm = findUser.email.split('@')[0];
        const firstTwoDigits = npm.substring(0, 2);
        const cohort = '20' + firstTwoDigits;

        await sequelize.transaction(async (t) => {
          await Student.create({ id, MajorId, LecturerId, semester, npm, cohort }, { transaction: t });
          await User.update({ isComplete: true }, { where: { id } }, { transaction: t });
          const newChat = await Chat.create({ StudentId: id, LecturerId }, { transaction: t });

          // creating new chat document in firestore
          const chatsRef = db.collection('chats').doc(`chat-${newChat.id.toString()}`);
          await chatsRef.set({
            createdAt: newChat.createdAt,
            updatedAt: newChat.updatedAt,
            participants: [findUser.email, findLecturer.User.email],
          });
        });
      } else {
        await sequelize.transaction(async (t) => {
          await Lecturer.create({ id, MajorId, nip }, { transaction: t });
          await User.update({ isComplete: true }, { where: { id } }, { transaction: t });
        });
      }

      res.status(201).json({ data: { message: 'Berhasil melengkapi data!' } });
    } catch (err) {
      console.log('----- controllers/UserController.js (completeData) -----\n', err);
      next(err);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const { id } = req.user;
      const findUser = await User.findByPk(id);
      let findUserDetail;
      const condition = {
        where: { id },
        include: [
          {
            model: Major,
            include: [{ model: Faculty }],
          },
        ],
      };

      if (findUser.role === 'mahasiswa') {
        condition.include.push({
          model: Lecturer,
          include: [{ model: User }],
        });
        findUserDetail = await Student.findOne(condition);
      } else if (findUser.role === 'dosen') {
        findUserDetail = await Lecturer.findOne(condition);
      }

      res.json({
        data: {
          email: findUser.email,
          name: findUser.name,
          role: findUser.role,
          is_bio_complete: findUser.isComplete,
          major_id: findUserDetail.MajorId,
          major_name: findUserDetail.Major.name,
          faculty_id: findUserDetail.Major.FacultyId,
          faculty_name: findUserDetail.Major.Faculty.name,
          // Data Khusus Mahasiswa
          semester: findUserDetail?.semester,
          lecturer_id: findUserDetail?.LecturerId,
          lecturer_name: findUserDetail?.Lecturer?.User?.name,
          // Data Khusus Dosen
          nip: findUserDetail?.nip,
        },
      });
    } catch (err) {
      console.log('----- controllers/UserController.js (getUserProfile) -----\n', err);
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const old_access_token = req.headers['x-refresh-token'];
      console.log(req.headers);
      const payload = verifyToken(old_access_token);
      const access_token = createAccessToken(payload);
      const refresh_token = createRefreshToken(payload);
      res.json({ data: { access_token, refresh_token } });
    } catch (err) {
      console.log('----- controllers/UserController.js (refreshToken) -----\n', err);
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, semester, MajorId, LecturerId, nip } = req.body;
      const { id, role } = req.user;

      if (role === 'mahasiswa') {
        await sequelize.transaction(async (t) => {
          await User.update({ name }, { where: { id } }, { transaction: t });
          await Student.update({ MajorId, LecturerId, semester }, { where: { id } }, { transaction: t });
        });
      } else {
        await sequelize.transaction(async (t) => {
          await User.update({ name }, { where: { id } }, { transaction: t });
          await Lecturer.update({ MajorId, nip }, { where: { id } }, { transaction: t });
        });
      }

      res.json({ data: { message: 'Berhasil memperbarui profil!' } });
    } catch (err) {
      console.log('----- controllers/UserController.js (updateProfile) -----\n', err);
      next(err);
    }
  }
}

module.exports = UserController;

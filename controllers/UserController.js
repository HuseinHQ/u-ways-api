const { comparePassword } = require('../helpers/bcrypt');
const checkEmailAndRole = require('../helpers/checkEmailAndRole');
const { createAccessToken, createRefreshToken } = require('../helpers/jwt');
const { User, Student, Lecturer, sequelize, Major, Faculty } = require('../models/index');

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
            email: ['NOT_UPN'],
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
      const forward = findUser.role === 'dosen' && !findUser.isComplete ? true : false;
      const access_token = createAccessToken(payload);
      const refresh_token = createRefreshToken(payload);

      const getUserReq = { headers: { access_token } };
      // await this.getUser(getUserReq, res, next);
      res.status(fromRegister ? 201 : 200).json({ data: { access_token, refresh_token, forward } });
    } catch (err) {
      console.log('----- controllers/UserController.js (login) -----\n', err);
      next(err);
    }
  }

  static async completeData(req, res, next) {
    try {
      const { id: UserId, role } = req.user;
      const { MajorId, LecturerId, semester } = req.body;

      const findStudentOrLecturer = await Student.findOne({ where: { UserId } });
      if (findStudentOrLecturer) throw { name: 'DataComplete' };

      if (role === 'mahasiswa') {
        await sequelize.transaction(async (t) => {
          const data = await Student.create({ UserId, MajorId, LecturerId, semester }, { transaction: t });
          await User.update({ isComplete: true }, { where: { id: UserId } }, { transaction: t });
        });
      } else {
        await sequelize.transaction(async (t) => {
          await Lecturer.create({ UserId, MajorId }, { transaction: t });
          await User.update({ isComplete: true }, { where: { id: UserId } }, { transaction: t });
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
        where: { UserId: id },
        include: [
          {
            model: Major,
            include: [{ model: Faculty }],
          },
        ],
      };
      if (findUser.role === 'mahasiswa') {
        findUserDetail = await Student.findOne(condition);
      } else if (findUser.role === 'dosen') {
        findUserDetail = await Lecturer.findOne(condition);
      }
      console.log(findUserDetail.dataValues);
    } catch (err) {
      console.log('----- controllers/UserController.js (getUser) -----\n', err);
      next(err);
    }
  }
}

module.exports = UserController;

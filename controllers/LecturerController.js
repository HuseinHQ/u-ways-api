const checkEmailAndRole = require('../helpers/checkEmailAndRole');
const { Lecturer, User, Major, Faculty, Sequelize, sequelize } = require('../models/index');

class LecturerController {
  static async getAllLecturers(req, res, next) {
    try {
      const { FacultyId, search } = req.query;

      const where = {};
      if (search) {
        where[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.iLike]: `%${search}%` } },
          { email: { [Sequelize.Op.iLike]: `%${search}%` } },
        ];
      }

      const include = [
        {
          model: User,
          required: true,
          where,
        },
      ];

      if (FacultyId) {
        include.push({
          model: Major,
          required: true,
          include: [
            {
              model: Faculty,
              where: { id: FacultyId },
            },
          ],
        });
      }

      let data = await Lecturer.findAll({ include });
      data = data.map((el) => ({
        id: el.id,
        name: el.User.name,
        email: el.User.email,
      }));
      res.json({ data });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (getAllLecturers) -----\n', err);
      next(err);
    }
  }

  static async deleteLecturer(req, res, next) {
    try {
      const { id } = req.params;
      const findLecturer = await Lecturer.findByPk(id);
      if (!findLecturer) {
        throw { name: 'LecturerNotFound', data: id };
      }
      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw { name: 'UserNotFound', data: id };
      }

      await User.destroy({ where: { id } });

      res.json({ data: { message: `Dosen dengan id ${id} berhasil dihapus!` } });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (deleteLecturer) -----\n', err);
      next(err);
    }
  }

  static async bulkDeleteLecturer(req, res, next) {
    try {
      const ids = req.body;
      await User.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: ids,
          },
        },
      });

      res.json({ data: { message: 'Dosen berhasil didelete!' } });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (bulkDeleteLecturer) -----\n', err);
      next(err);
    }
  }

  static async getLecturer(req, res, next) {
    try {
      const { id } = req.params;
      const findLecturer = await Lecturer.findByPk(id, { include: [{ model: Major, include: Faculty }, User] });
      if (!findLecturer) {
        throw { name: 'LecturerNotFound', data: id };
      }

      const response = {
        id,
        email: findLecturer.User.email,
        name: findLecturer.User.name,
        role: findLecturer.User.role,
        nip: findLecturer.nip,
        Major: {
          id: findLecturer.Major.id,
          name: findLecturer.Major.name,
        },
        Faculty: {
          id: findLecturer.Major.Faculty.id,
          name: findLecturer.Major.Faculty.name,
        },
        createdAt: findLecturer.createdAt,
        updatedAt: findLecturer.updatedAt,
      };

      res.json({ data: response });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (getLecturer) -----\n', err);
      next(err);
    }
  }

  static async editLecturer(req, res, next) {
    try {
      const { name, email, nip, MajorId } = req.body;
      const { id } = req.params;

      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw { name: 'UserNotFound', data: id };
      }

      const findlecturer = await Lecturer.findByPk(id);
      if (!findlecturer) {
        throw { name: 'LecturerNotFound', data: id };
      }

      const lecturerEmail = checkEmailAndRole(email);
      if (lecturerEmail !== 'dosen') {
        throw { name: 'InvalidEmail' };
      }

      await sequelize.transaction(async (transaction) => {
        await User.update({ name, email }, { where: { id } }, { transaction });
        await Lecturer.update({ nip, MajorId }, { where: { id } }, { transaction });
      });

      res.json({ data: { message: `Data dosen dengan id ${id} berhasil diubah!` } });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (editLecturer) -----\n', err);
      next(err);
    }
  }
}

module.exports = LecturerController;

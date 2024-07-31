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
      const findUser = await User.findByPk(findLecturer.UserId);
      if (!findUser) {
        throw { name: 'UserNotFound', data: id };
      }

      await sequelize.transaction(async (transaction) => {
        await Lecturer.destroy({ where: { id } }, { transaction });
        await User.destroy({ where: { id: findUser.id } }, { transaction });
      });

      res.json({ message: `Dosen dengan id ${id} berhasil dihapus!` });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (deleteLecturer) -----\n', err);
      next(err);
    }
  }
}

module.exports = LecturerController;

const { Lecturer, User, Major, Faculty, Sequelize } = require('../models/index');

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
}

module.exports = LecturerController;

const { Faculty, Major, Sequelize } = require('../models/index');

class FacultyController {
  static async getAllFaculties(req, res, next) {
    try {
      const { search } = req.query;
      const where = {};
      if (search) {
        where.name = { [Sequelize.Op.iLike]: `%${search}%` };
      }

      let data = await Faculty.findAll({ where, include: [Major] });
      data = data.map((el) => ({
        id: el.id,
        name: el.name,
        Majors: el.Majors.map((major) => ({
          id: major.id,
          name: major.name,
        })),
      }));
      res.json({ data });
    } catch (err) {
      console.log('----- controllers/FacultyController.js (getAllFaculties) -----\n', err);
      next(err);
    }
  }
}

module.exports = FacultyController;

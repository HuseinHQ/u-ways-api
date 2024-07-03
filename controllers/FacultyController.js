const { Faculty, Major } = require('../models/index');

class FacultyController {
  static async getAllFaculties(req, res, next) {
    try {
      let data = await Faculty.findAll({ include: [Major] });
      data = data.map((el) => ({
        id: el.id,
        name: el.name,
        Majors: el.Majors.map((major) => ({
          MajorId: major.id,
          name: major.name,
        })),
      }));
      res.json({ data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FacultyController;

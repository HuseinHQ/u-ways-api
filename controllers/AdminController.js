const { Student, Lecturer, sequelize } = require('../models/index');

class AdminController {
  static async getDashboardData(req, res, next) {
    try {
      const lecturerCount = await Lecturer.count();
      const studentCount = await Student.count();

      res.json({ data: { lecturerCount, studentCount } });
    } catch (err) {
      console.log('----- controllers/AdminController.js (getDashboardData) -----\n', err);
      next(err);
    }
  }
}

module.exports = AdminController;

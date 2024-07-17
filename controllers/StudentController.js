const { Lecturer, Student, User, sequelize } = require('../models/index');

class StudentController {
  static async getAllStudents(req, res, next) {
    try {
      const { cohort } = req.query;
      const where = {};

      const { role, id } = req.user;
      if (role === 'dosen') {
        const findLecturer = await Lecturer.findOne({ where: { UserId: id } });
        where.LecturerId = findLecturer.id;
      }

      const cohorts = await Student.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('cohort')), 'cohort']],
        order: [['cohort', 'ASC']],
      });

      const cohortList = cohorts.map((c) => c.cohort);
      const defaultCohort = cohortList.length > 0 ? cohortList[0] : null;

      if (cohort) {
        where.cohort = cohort;
      } else {
        where.cohort = defaultCohort;
      }

      const students = await Student.findAll({
        where,
        include: [User],
        order: [['npm', 'ASC']],
      });

      const response = {
        data: students.map((student) => ({
          id: student.User.id, // user id
          name: student.User.name,
          npm: student.npm,
        })),
        pagination: {
          cohortList,
          cohort: +cohort || defaultCohort,
        },
      };

      res.json(response);
    } catch (err) {
      console.log('----- controllers/StudentController.js (getAllStudents) -----\n', err);
      next(err);
    }
  }
}

module.exports = StudentController;

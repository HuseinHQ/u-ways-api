const checkEmailAndRole = require('../helpers/checkEmailAndRole');
const { Student, User, sequelize, Sequelize, Major, Faculty, Lecturer } = require('../models/index');

class StudentController {
  static async getAllStudentsByCohort(req, res, next) {
    try {
      const { cohort, search } = req.query;
      const where = {};

      const { role, id } = req.user;
      if (role === 'dosen') {
        where.LecturerId = id;
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
          id: student.id,
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
      console.log('----- controllers/StudentController.js (getAllStudentsByCohort) -----\n', err);
      next(err);
    }
  }

  static async getAllStudents(req, res, next) {
    try {
      const { search } = req.query;
      const where = {};
      if (search) {
        where[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.iLike]: `%${search}%` } },
          { email: { [Sequelize.Op.iLike]: `%${search}%` } },
        ];
      }

      const students = await Student.findAll({
        include: {
          model: User,
          required: true,
          where,
        },
        order: [[User, 'email', 'DESC']],
      });

      const response = students.map((student) => ({
        id: student.id,
        name: student.User.name,
        email: student.User.email,
      }));

      res.json({ data: response });
    } catch (err) {
      console.log('----- controllers/StudentController.js (getAllStudents) -----\n', err);
      next(err);
    }
  }

  static async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;
      const findStudent = await Student.findByPk(id);
      if (!findStudent) {
        throw { name: 'StudentNotFound', data: id };
      }
      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw { name: 'UserNotFound', data: id };
      }

      await User.destroy({ where: { id } });

      res.json({ data: { message: `Mahasiswa dengan id ${id} berhasil dihapus!` } });
    } catch (err) {
      console.log('----- controllers/StudentController.js (deleteStudent) -----\n', err);
      next(err);
    }
  }

  static async bulkDeleteStudent(req, res, next) {
    try {
      const ids = req.body;
      await User.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: ids,
          },
        },
      });

      res.json({ data: { message: 'Mahasiswa berhasil didelete!' } });
    } catch (err) {
      console.log('----- controllers/StudentController.js (bulkDeleteStudent) -----\n', err);
      next(err);
    }
  }

  static async getStudent(req, res, next) {
    try {
      const { id } = req.params;
      const findStudent = await Student.findByPk(id, {
        include: [{ model: Major, include: Faculty }, User, { model: Lecturer, include: User }],
      });
      if (!findStudent) {
        throw { name: 'StudentNotFound', data: id };
      }

      const response = {
        id,
        email: findStudent.User.email,
        name: findStudent.User.name,
        role: findStudent.User.role,
        semester: findStudent.semester,
        npm: findStudent.npm,
        cohort: findStudent.cohort,
        Major: {
          id: findStudent.Major.id,
          name: findStudent.Major.name,
        },
        Faculty: {
          id: findStudent.Major.Faculty.id,
          name: findStudent.Major.Faculty.name,
        },
        Lecturer: {
          id: findStudent.Lecturer.id,
          name: findStudent.Lecturer.User.name,
        },
        createdAt: findStudent.createdAt,
        updatedAt: findStudent.updatedAt,
      };

      res.json({ data: response });
    } catch (err) {
      console.log('----- controllers/StudentController.js (getStudent) -----\n', err);
      next(err);
    }
  }

  static async editStudent(req, res, next) {
    try {
      const { name, email, MajorId, LecturerId, semester, npm, cohort } = req.body;
      const { id } = req.params;

      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw { name: 'UserNotFound', data: id };
      }

      const findStudent = await Student.findByPk(id);
      if (!findStudent) {
        throw { name: 'StudentNotFound', data: id };
      }

      const studentEmail = checkEmailAndRole(email);
      if (studentEmail !== 'mahasiswa') {
        throw { name: 'InvalidEmail' };
      }

      await sequelize.transaction(async (transaction) => {
        await User.update({ name, email }, { where: { id } }, { transaction });
        await Student.update({ MajorId, LecturerId, semester, npm, cohort }, { where: { id } }, { transaction });
      });

      res.json({ data: { message: `Data mahasiswa dengan id ${id} berhasil diubah!` } });
    } catch (err) {
      console.log('----- controllers/StudentController.js (editStudent) -----\n', err);
      next(err);
    }
  }

  static async incrementAllStudentSemester() {
    try {
      await Student.update({ semester: Sequelize.literal('semester + 1') }, { order: [['id', 'DESC']], where: {} });
      console.log('Berhasil menambahkan semester untuk semua mahasiswa!');
    } catch (err) {
      console.log('----- controllers/StudentController.js (incrementAllStudentSemester) -----\n', err);
    }
  }
}

module.exports = StudentController;

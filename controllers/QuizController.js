const generateQuizArray = require('../helpers/generateQuizArray');
const getSemesterPart = require('../helpers/getCurrentSemester');
const { Quiz, Student, Sequelize, QuizResult, NewQuiz } = require('../models/index');

class QuizController {
  static async getQuizHistory(req, res, next) {
    try {
      const { id } = req.user;
      const quizzes = await Quiz.findAll({ where: { UserId: id } });
      let totalScore = 0;
      const data = quizzes.map((el) => {
        totalScore += el.score;
        return { id: el.id, score: el.score, semester: el.semester, part: el.part };
      });
      const averageScore = parseFloat((totalScore / quizzes.length).toFixed(2));
      res.json({ data, summary: { totalScore, averageScore } });
    } catch (err) {
      console.log('----- controllers/QuizController.js (getQuizHistory) -----\n', err);
      next(err);
    }
  }

  static async getQuizzes(req, res, next) {
    try {
      const { search } = req.query;
      const where = {};
      if (search) {
        where.title = {
          [Sequelize.Op.iLike]: `%${search}%`,
        };
      }

      const quizzes = await Quiz.findAll({
        attributes: ['id', 'title', 'semester', 'part'],
        order: [
          ['semester', 'ASC'],
          ['part', 'ASC'],
        ],
        where,
      });
      res.json({ data: quizzes });
    } catch (err) {
      console.log('----- controllers/QuizController.js (getQuizzes) -----\n', err);
      next(err);
    }
  }

  static async postQuiz(req, res, next) {
    try {
      const { title, details, semester, part, startTime, endTime } = req.body;
      const findQuiz = await Quiz.findOne({ where: { semester, part } });
      if (findQuiz) {
        throw { name: 'QuizExist', data: { semester, part } };
      }

      await Quiz.create({ title, details: JSON.stringify(details), semester, part, startTime, endTime });
      res.json({ data: { message: 'Berhasil membuat quiz baru!' } });
    } catch (err) {
      console.log('----- controllers/QuizController.js (postQuiz) -----\n', err);
      next(err);
    }
  }

  static async deleteQuiz(req, res, next) {
    try {
      const { id } = req.params;
      await Quiz.destroy({ where: { id } });
      res.json({ data: { message: `Berhasil menghapus quiz dengan id ${id}!` } });
    } catch (err) {
      console.log('----- controllers/QuizController.js (deleteQuiz) -----\n', err);
      next(err);
    }
  }

  static async bulkDeleteQuiz(req, res, next) {
    try {
      const ids = req.body;
      await Quiz.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: ids,
          },
        },
      });

      res.json({ data: { message: 'Quiz berhasil didelete!' } });
    } catch (err) {
      console.log('----- controllers/QuizController.js (bulkDeleteQuiz) -----\n', err);
      next(err);
    }
  }

  static async editQuiz(req, res, next) {
    try {
      const { id } = req.params;
      const { title, details, semester, part, startTime, endTime } = req.body;

      const findQuiz = await Quiz.findByPk(id);
      if (!findQuiz) {
        throw { name: 'QuizNotFound', data: id };
      }

      await Quiz.update(
        { title, details: JSON.stringify(details), semester, part, startTime, endTime },
        { where: { id } }
      );
      res.json({ data: { message: `Quiz dengan id ${id} berhasil diubah!` } });
    } catch (err) {
      console.log('----- controllers/QuizController.js (editQuiz) -----\n', err);
      next(err);
    }
  }

  static async getQuizDetail(req, res, next) {
    try {
      const { id } = req.params;
      let findQuiz = await Quiz.findByPk(id);
      if (!findQuiz) {
        throw { name: 'QuizNotFound', data: id };
      }
      // Check if findQuiz.details is a string before parsing
      if (typeof findQuiz.details === 'string') {
        findQuiz.details = JSON.parse(findQuiz.details);
      }

      res.json({ data: findQuiz });
    } catch (err) {
      console.log('----- controllers/QuizController.js (getQuizDetail) -----\n', err);
      next(err);
    }
  }

  static async studentQuiz(req, res, next) {
    try {
      const { id, role } = req.user;
      if (role !== 'mahasiswa') {
        throw { name: 'StudentOnly' };
      }
      const findStudent = await Student.findByPk(id);
      const currentSemester = findStudent.semester;
      const currentPart = getSemesterPart();

      // mendapatkan data quiz yang sudah pernah disubmit oleh mahasiswa sebelumnya
      const findQuizResult = await QuizResult.findAll({
        attributes: ['semester', 'part'],
        order: [
          ['semester', 'ASC'],
          ['part', 'ASC'],
        ],
        where: { StudentId: id },
      });

      const lastSemester = findQuizResult?.at(-1)?.semester;
      const lastPart = findQuizResult?.at(-1)?.part;

      let where = {};
      if (lastSemester !== undefined && lastPart !== undefined) {
        where = {
          [Sequelize.Op.or]: [
            {
              semester: lastSemester,
              part: {
                [Sequelize.Op.gt]: lastPart,
              },
            },
            {
              semester: {
                [Sequelize.Op.between]: [lastSemester + 1, currentSemester - 1],
              },
            },
            {
              semester: currentSemester,
              part: {
                [Sequelize.Op.lte]: currentPart,
              },
            },
          ],
        };
      }

      // mendapatkan semua quiz yang belum pernah dikerjakan dan kurang dari sama dengan semester mahasiswa saat ini
      const findQuiz = await Quiz.findAll({
        attributes: ['id', 'title', 'semester', 'part', 'startTime', 'endTime'],
        order: [
          ['semester', 'ASC'],
          ['part', 'ASC'],
        ],
        where,
      });

      const result = findQuiz.filter((quiz) => {
        return !findQuizResult.some((result) => {
          return quiz.semester === result.semester && quiz.part === result.part;
        });
      });

      res.json({ data: result });
    } catch (err) {
      console.log('----- controllers/QuizController.js (studentQuiz) -----\n', err);
      next(err);
    }
  }

  static async getAvailableQuizzes(req, res, next) {
    try {
      const { id, role } = req.user;
      if (role !== 'mahasiswa') {
        throw { name: 'StudentOnly' };
      }
      const findStudent = await Student.findByPk(id);
      const currentSemester = findStudent.semester;
      const currentPart = getSemesterPart();

      const findQuizResult = await QuizResult.findAll({
        attributes: ['semester', 'part'],
        order: [
          ['semester', 'ASC'],
          ['part', 'ASC'],
        ],
        where: { StudentId: id },
      });

      const existingResults = findQuizResult.map((result) => ({
        semester: result.semester,
        part: result.part,
      }));

      console.log('Existing Results:', existingResults);

      const result = generateQuizArray(currentSemester, currentPart, existingResults);
      console.log('Generated Result:', result);
      res.json({ data: result });
    } catch (err) {
      console.log('----- controllers/QuizController.js (getQuizResult) -----\n', err);
      next(err);
    }
  }

  static async getQuiz(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== 'mahasiswa') {
        throw { name: 'StudentOnly' };
      }

      const findQuiz = await NewQuiz.findAll();

      res.json({ data: findQuiz });
    } catch (err) {
      console.log('----- controllers/QuizController.js (getQuiz) -----\n', err);
      next(err);
    }
  }
}

module.exports = QuizController;

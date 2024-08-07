const getSemesterPart = require('../helpers/getCurrentSemester');
const { Quiz, Student, Sequelize } = require('../models/index');

class QuizController {
  static async getQuizHistory(req, res, next) {
    try {
      const { id, role } = req.user;
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
      const quizzes = await Quiz.findAll({
        attributes: ['id', 'title', 'semester', 'part'],
        order: [
          ['semester', 'ASC'],
          ['part', 'ASC'],
        ],
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
      findQuiz.details = JSON.parse(findQuiz.details);

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
      const semester = findStudent.semester;
      const part = getSemesterPart();

      const quizzes = await Quiz.findAll({ where: { semester, part } });
      res.json({ data: quizzes });
    } catch (err) {
      console.log('----- controllers/QuizController.js (searchQuiz) -----\n', err);
      next(err);
    }
  }
}

module.exports = QuizController;

const { QuizResult, Student, Quiz } = require('../models/index');

class QuizResultController {
  static async getAllQuizResults(req, res, next) {
    try {
      const { id } = req.user;
      const quizResults = await QuizResult.findAll({ where: { StudentId: id } });
      const scoreSum = quizResults.reduce((acc, curr) => +acc + +curr.score, 0);
      const scoreAverage = scoreSum / quizResults.length;
      const formattedScoreAverage = scoreAverage % 1 === 0 ? scoreAverage : scoreAverage.toFixed(1);
      res.json({ data: quizResults, summary: { totalScore: scoreSum, scoreAverage: formattedScoreAverage } });
    } catch (err) {
      console.log('----- controllers/QuizResultController.js (getAllQuizResults) -----\n', err);
      next(err);
    }
  }

  static async getAllQuizResultsByStudentId(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const quizResults = await QuizResult.findAll({ where: { StudentId: id } });
      const scoreSum = quizResults.reduce((acc, curr) => +acc + +curr.score, 0);
      const scoreAverage = scoreSum / quizResults.length;
      const formattedScoreAverage = scoreAverage % 1 === 0 ? scoreAverage : scoreAverage.toFixed(1);
      res.json({ data: quizResults, summary: { totalScore: scoreSum, scoreAverage: formattedScoreAverage } });
    } catch (err) {
      console.log('----- controllers/QuizResultController.js (getAllQuizResults) -----\n', err);
      next(err);
    }
  }

  static async createQuizResult(req, res, next) {
    try {
      const { id } = req.user;
      const { semester, part, score, answer } = req.body;

      const findQuizResult = await QuizResult.findOne({ where: { StudentId: id, semester, part } });
      if (findQuizResult) throw { name: 'QuizTaken' };

      const findQuiz = await Quiz.findOne({ where: { semester, part } });
      if (!findQuiz) throw { name: 'QuizNotFound' };

      const findStudent = await Student.findOne({ where: { id } });
      if (!findStudent) throw { name: 'StudentNotFound' };

      const newQuizResult = await QuizResult.create({
        StudentId: id,
        QuizId: findQuiz.id,
        semester,
        part,
        score,
        answer,
      });

      res.status(201).json({ data: { message: 'Berhasil mengirim kuis!', newQuizId: newQuizResult.id } });
    } catch (err) {
      console.log('----- controllers/QuizResultController.js (createQuizResult) -----\n', err);
      next(err);
    }
  }

  static async getQuizResult(req, res, next) {
    try {
      const { id } = req.params;
      const quizResult = await QuizResult.findByPk(id);

      res.json({ data: quizResult });
    } catch (err) {
      console.log('----- controllers/QuizResultController.js (getQuizResult) -----\n', err);
      next(err);
    }
  }
}

module.exports = QuizResultController;

const { QuizResult, Student } = require('../models/index');

class QuizResultController {
  static async getAllQuizResults(req, res, next) {
    try {
      const { id } = req.user;
      const quizResults = await QuizResult.findAll({ where: { StudentId: id } });
      res.json({ data: quizResults });
    } catch (err) {
      console.log('----- controllers/QuizResultController.js (getAllQuizResults) -----\n', err);
      next(err);
    }
  }

  static async createQuizResult(req, res, next) {
    try {
      const { id } = req.user;
      const { QuizId, semester, part, score, answer } = req.body;

      const findStudent = await Student.findOne({ where: { id } });
      if (!findStudent) throw { name: 'StudentNotFound' };

      await QuizResult.create({ StudentId: id, QuizId, semester, part, score, answer });

      res.status(201).json({ data: { message: 'Berhasil mengirim kuis!' } });
    } catch (err) {
      console.log('----- controllers/QuizResultController.js (createQuizResult) -----\n', err);
      next(err);
    }
  }
}

module.exports = QuizResultController;

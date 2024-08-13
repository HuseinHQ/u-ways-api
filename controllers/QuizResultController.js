const { QuizResult } = require('../models/index');

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
}

module.exports = QuizResultController;

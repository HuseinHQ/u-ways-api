const { Quiz } = require('../models/index');

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
}

module.exports = QuizController;

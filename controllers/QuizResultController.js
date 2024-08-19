const { QuizResult, Student, Quiz } = require('../models/index');

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
}

module.exports = QuizResultController;

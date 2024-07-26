const { Question, QuestionDetail } = require('../models/index');

class QuestionController {
  static async getQuestions(req, res, next) {
    try {
      const questions = await Question.findAll();
      res.json({ data: questions });
    } catch (err) {
      console.log('----- controllers/QuestionController.js (getQuestions) -----\n', err);
      next(err);
    }
  }

  static async getQuestionDetail(req, res, next) {
    try {
      const { id } = req.params;
      const findQuestion = Question.findByPk(id);
      if (!findQuestion) {
        throw { name: 'QuestionNotFound', data: id };
      }

      const findQuestionDetail = await Question.findByPk(id, { include: [QuestionDetail] });
      res.json({ data: findQuestionDetail });
    } catch (err) {
      console.log('----- controllers/QuestionController.js (getQuestionDetail) -----\n', err);
      next(err);
    }
  }

  static async getPublishedQuestion(req, res, next) {
    try {
      const findPublishedQuestion = await Question.findOne({ where: { published: true }, include: QuestionDetail });
      res.json({ data: findPublishedQuestion });
    } catch (err) {
      console.log('----- controllers/QuestionController.js (getPublishedQuestion) -----\n', err);
      next(err);
    }
  }

  static async publishQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const findQuestion = await Question.findByPk(id);
      if (!findQuestion) {
        throw { name: 'QuestionNotFound', data: id };
      }

      await Question.update({ published: !findQuestion.published }, { where: { id } });
      res.json({ data: { message: `Berhasil ${findQuestion.published ? 'Unpublish' : 'Publish'} kuesioner!` } });
    } catch (err) {
      console.log('----- controllers/QuestionController.js (publishQuestion) -----\n', err);
      next(err);
    }
  }

  static async createQuestionDetails(req, res, next) {
    try {
      const { id } = req.params;
      await QuestionDetail.destroy({ where: { QuestionId: id } });
      const data = req.body;
      const mappedData = data.map((el) => {
        el.QuestionId = id;
        return el;
      });

      await QuestionDetail.bulkCreate(mappedData);
      res.json({ data: { message: 'Berhasil mengubah detail kuesioner!' } });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = QuestionController;

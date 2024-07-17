const { where } = require('sequelize');
const { Article } = require('../models/index');

class ArticleController {
  static async getArticles(req, res, next) {
    try {
      let { limit, page } = req.query;
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 1;
      const offset = (page - 1) * limit;

      const articles = await Article.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      const totalCount = await Article.count();

      res.status(200).json({
        data: articles,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (getArticles) -----\n', err);
      next(err);
    }
  }

  static async getArticleDetails(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);

      res.json({ data: article });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (getArticleDetails) -----\n', err);
      next(err);
    }
  }

  static async editArticle(req, res, next) {
    try {
      const { id } = req.params;
      const { title, abstract, description } = req.body;
      const findArticle = await Article.findByPk(id);
      if (!findArticle) {
        throw { name: 'ArticleNotFound', data: id };
      }

      await Article.update({ title, abstract, description }, { where: { id } });
      res.json({ data: { message: 'Berhasil mengubah artikel!' } });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (editArticle) -----\n', err);
      next(err);
    }
  }
}

module.exports = ArticleController;

const { Article, Sequelize } = require('../models/index');
const cloudinary = require('../config/cloudinaryConfig');

class ArticleController {
  static async getArticles(req, res, next) {
    try {
      let { limit, page, search } = req.query;
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 1;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where.title = { [Sequelize.Op.iLike]: `%${search}%` };
      }

      const articles = await Article.findAll({
        limit,
        offset,
        where,
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
      const { title, abstract, description, author } = req.body;
      const findArticle = await Article.findByPk(id);
      if (!findArticle) {
        throw { name: 'ArticleNotFound', data: id };
      }

      await Article.update({ title, abstract, description, author }, { where: { id } });
      res.json({ data: { message: 'Berhasil mengubah artikel!' } });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (editArticle) -----\n', err);
      next(err);
    }
  }

  static async createArticle(req, res, next) {
    try {
      const { title, abstract, description, author } = req.body;
      const newArticle = await Article.create({ title, abstract, description, author });

      res.json({ data: { message: 'Berhasil menambah artikel!', id: newArticle.id } });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (createArticle) -----\n', err);
      next(err);
    }
  }

  static async postArticleImage(req, res, next) {
    try {
      const { id } = req.params;
      const findArticle = await Article.findByPk(id);
      if (!findArticle) {
        throw { name: 'ArticleNotFound' };
      }

      const { image } = req.files;
      if (!image) {
        throw { name: 'NoImageUpload' };
      }

      const { secure_url } = await cloudinary.uploader.upload(image.tempFilePath).catch((error) => {
        throw { name: 'CloudinaryError' };
      });

      await Article.update({ imageUrl: secure_url }, { where: { id } });
      res.status(201).json({ data: { message: 'Gambar berhasil diunggah!' } });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (postArticleImage) -----\n', err);
      next(err);
    }
  }

  static async bulkDeleteArticle(req, res, next) {
    try {
      const ids = req.body;
      await Article.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: ids,
          },
        },
      });

      res.json({ data: { message: 'Berhasil menghapus artikel!' } });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (bulkDeleteArticle) -----\n', err);
      next(err);
    }
  }

  static async deleteArticle(req, res, next) {
    try {
      const { id } = req.params;
      const findArticle = await Article.findByPk(id);
      if (!findArticle) {
        throw { name: 'ArticleNotFound', data: id };
      }

      await Article.destroy({ where: { id } });
      res.json({ data: { message: `Artikel dengan id ${id} berhasil dihapus!` } });
    } catch (err) {
      console.log('----- controllers/ArticleController.js (deleteArticle) -----\n', err);
      next(err);
    }
  }
}

module.exports = ArticleController;

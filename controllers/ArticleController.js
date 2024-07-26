const { Article } = require('../models/index');
const cloudinary = require('../config/cloudinaryConfig');

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

  static async createArticle(req, res, next) {
    try {
      const { title, abstract, description } = req.body;
      await Article.create({ title, abstract, description });

      res.json({ data: { message: 'Berhasil menambah artikel!' } });
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
}

module.exports = ArticleController;

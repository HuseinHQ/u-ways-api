const router = require('.');
const ArticleController = require('../controllers/ArticleController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const articleRouter = require('express').Router();

articleRouter.use(authentication);
articleRouter.get('/', ArticleController.getArticles);
articleRouter.get('/:id', ArticleController.getArticleDetails);
articleRouter.put('/:id', adminOnly, ArticleController.editArticle);

module.exports = articleRouter;

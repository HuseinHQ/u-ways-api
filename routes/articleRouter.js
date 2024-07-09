const router = require('.');
const ArticleController = require('../controllers/ArticleController');
const authentication = require('../middlewares/authentication');

const articleRouter = require('express').Router();

articleRouter.use(authentication);
articleRouter.get('/', ArticleController.getArticles);
articleRouter.get('/:id', ArticleController.getArticleDetails);

module.exports = articleRouter;

const ArticleController = require('../controllers/ArticleController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const articleRouter = require('express').Router();

articleRouter.use(authentication);
articleRouter.get('/', ArticleController.getArticles);
articleRouter.post('/', adminOnly, ArticleController.createArticle);
articleRouter.delete('/', adminOnly, ArticleController.bulkDeleteArticle);
articleRouter.get('/:id', ArticleController.getArticleDetails);
articleRouter.put('/:id', adminOnly, ArticleController.editArticle);
articleRouter.delete('/:id', adminOnly, ArticleController.deleteArticle);
articleRouter.post('/:id/image', adminOnly, ArticleController.postArticleImage);

module.exports = articleRouter;

const QuestionController = require('../controllers/QuestionController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const questionRouter = require('express').Router();

questionRouter.use(authentication);

questionRouter.get('/published', QuestionController.getPublishedQuestion);

questionRouter.use(adminOnly);
questionRouter.get('/', QuestionController.getQuestions);
questionRouter.get('/:id', QuestionController.getQuestionDetail);
questionRouter.post('/:id', QuestionController.createQuestionDetails);
questionRouter.patch('/:id/publish', QuestionController.publishQuestion);

module.exports = questionRouter;

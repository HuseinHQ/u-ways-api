const QuizController = require('../controllers/QuizController');
const authentication = require('../middlewares/authentication');
const quizRouter = require('express').Router();

quizRouter.use(authentication);
quizRouter.get('/', QuizController.getQuizHistory);

module.exports = quizRouter;

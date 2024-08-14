const QuizResultController = require('../controllers/QuizResultController');
const authentication = require('../middlewares/authentication');
const quizResultRouter = require('express').Router();
const studentOnly = require('../middlewares/studentOnly');

quizResultRouter.use(authentication);
quizResultRouter.use(studentOnly);

quizResultRouter.get('/', QuizResultController.getAllQuizResults);
quizResultRouter.post('/', QuizResultController.createQuizResult);

module.exports = quizResultRouter;

const QuizResultController = require('../controllers/QuizResultController');
const authentication = require('../middlewares/authentication');
const quizResultRouter = require('express').Router();
const studentOnly = require('../middlewares/studentOnly');

quizResultRouter.use(authentication);

quizResultRouter.get('/student/:id', QuizResultController.getAllQuizResultsByStudentId);

quizResultRouter.use(studentOnly);
quizResultRouter.get('/', QuizResultController.getAllQuizResults);
quizResultRouter.post('/', QuizResultController.createQuizResult);
quizResultRouter.get('/:id', QuizResultController.getQuizResult);

module.exports = quizResultRouter;

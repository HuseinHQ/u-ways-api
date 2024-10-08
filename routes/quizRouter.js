const QuizController = require('../controllers/QuizController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');
const quizRouter = require('express').Router();

quizRouter.use(authentication);

quizRouter.get('/student', QuizController.studentQuiz);
quizRouter.get('/available', QuizController.getAvailableQuizzes);
quizRouter.get('/new-quiz', QuizController.getQuiz);
quizRouter.get('/:id', QuizController.getQuizDetail);

quizRouter.use(adminOnly);
quizRouter.get('/', QuizController.getQuizzes);
quizRouter.post('/', QuizController.postQuiz);
quizRouter.delete('/', QuizController.bulkDeleteQuiz);
quizRouter.delete('/:id', QuizController.deleteQuiz);
quizRouter.put('/:id', QuizController.editQuiz);

module.exports = quizRouter;

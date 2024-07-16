const StudentController = require('../controllers/StudentController');
const authentication = require('../middlewares/authentication');

const studentRouter = require('express').Router();

studentRouter.use(authentication);
studentRouter.get('/', StudentController.getAllStudents);

module.exports = studentRouter;

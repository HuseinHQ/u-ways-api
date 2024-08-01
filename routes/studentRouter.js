const StudentController = require('../controllers/StudentController');
const authentication = require('../middlewares/authentication');
const adminOnly = require('../middlewares/adminOnly');

const studentRouter = require('express').Router();

studentRouter.use(authentication);
studentRouter.get('/', StudentController.getAllStudentsByCohort);
studentRouter.get('/all', adminOnly, StudentController.getAllStudents);
studentRouter.get('/:id', StudentController.getStudent);

studentRouter.use(adminOnly);
studentRouter.delete('/', StudentController.bulkDeleteStudent);
studentRouter.put('/:id', StudentController.editStudent);
studentRouter.delete('/:id', StudentController.deleteStudent);

module.exports = studentRouter;

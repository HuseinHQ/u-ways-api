const FacultyController = require('../controllers/FacultyController');
const authentication = require('../middlewares/authentication');

const facultyRouter = require('express').Router();

facultyRouter.use(authentication);
facultyRouter.get('/', FacultyController.getAllFaculties);

module.exports = facultyRouter;

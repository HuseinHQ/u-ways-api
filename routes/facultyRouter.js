const FacultyController = require('../controllers/FacultyController');
const authentication = require('../middlewares/authentication');
const adminOnly = require('../middlewares/adminOnly');

const facultyRouter = require('express').Router();

facultyRouter.use(authentication);
facultyRouter.get('/', FacultyController.getAllFaculties);

facultyRouter.use(adminOnly);
facultyRouter.post('/', FacultyController.addFaculty);
facultyRouter.delete('/', FacultyController.bulkDeleteFaculty);
facultyRouter.put('/:id', FacultyController.editFaculty);

module.exports = facultyRouter;

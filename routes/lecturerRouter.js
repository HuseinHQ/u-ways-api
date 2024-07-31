const LecturerController = require('../controllers/LecturerController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const lecturerRouter = require('express').Router();

lecturerRouter.use(authentication);
lecturerRouter.get('/', LecturerController.getAllLecturers);
lecturerRouter.delete('/:id', adminOnly, LecturerController.deleteLecturer);

module.exports = lecturerRouter;

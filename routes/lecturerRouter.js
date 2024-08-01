const LecturerController = require('../controllers/LecturerController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const lecturerRouter = require('express').Router();

lecturerRouter.use(authentication);
lecturerRouter.get('/', LecturerController.getAllLecturers);
lecturerRouter.get('/:id', LecturerController.getLecturer);

lecturerRouter.use(adminOnly);
lecturerRouter.delete('/', LecturerController.bulkDeleteLecturer);
lecturerRouter.put('/:id', LecturerController.editLecturer);
lecturerRouter.delete('/:id', LecturerController.deleteLecturer);

module.exports = lecturerRouter;

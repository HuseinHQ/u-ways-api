const LecturerController = require('../controllers/LecturerController');
const authentication = require('../middlewares/authentication');

const lecturerRouter = require('express').Router();

lecturerRouter.use(authentication);
lecturerRouter.get('/', LecturerController.getAllLecturers);

module.exports = lecturerRouter;

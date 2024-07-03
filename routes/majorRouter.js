const MajorController = require('../controllers/MajorController');
const authentication = require('../middlewares/authentication');

const majorRouter = require('express').Router();

majorRouter.use(authentication);
majorRouter.get('/', MajorController.getAllMajors);

module.exports = majorRouter;

const MajorController = require('../controllers/MajorController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const majorRouter = require('express').Router();

majorRouter.use(authentication);
majorRouter.get('/', MajorController.getAllMajors);

majorRouter.use(adminOnly);
majorRouter.post('/', MajorController.addMajor);
majorRouter.delete('/', MajorController.bulkDeleteMajor);
majorRouter.put('/:id', MajorController.editMajor);

module.exports = majorRouter;

const UserController = require('../controllers/UserController');
const authentication = require('../middlewares/authentication');
const userRouter = require('express').Router();

userRouter.use(authentication);
userRouter.get('/', UserController.getUserProfile);
userRouter.post('/complete-data', UserController.completeData);

module.exports = userRouter;

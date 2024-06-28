const UserController = require('../controllers/UserController');
const authentication = require('../middlewares/authentication');

const userRouter = require('express').Router();

userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);

userRouter.use(authentication);
userRouter.post('/complete-data', UserController.completeData);

module.exports = userRouter;

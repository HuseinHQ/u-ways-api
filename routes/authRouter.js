const UserController = require('../controllers/UserController');

const authRouter = require('express').Router();

authRouter.post('/register', UserController.register);
authRouter.post('/login', UserController.login);
authRouter.get('/refresh-token', UserController.refreshToken);

module.exports = authRouter;

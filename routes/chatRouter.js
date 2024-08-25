const ChatController = require('../controllers/ChatController');
const authentication = require('../middlewares/authentication');

const chatRouter = require('express').Router();

chatRouter.use(authentication);
chatRouter.get('/', ChatController.getChats);
chatRouter.patch('/:id', ChatController.updateChatDate);
chatRouter.post('/file', ChatController.postFile);

module.exports = chatRouter;

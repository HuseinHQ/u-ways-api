const CarouselController = require('../controllers/CarouselController');
const adminOnly = require('../middlewares/adminOnly');
const authentication = require('../middlewares/authentication');

const carouselRouter = require('express').Router();

carouselRouter.use(authentication);
carouselRouter.get('/', CarouselController.getAllCarousels);

module.exports = carouselRouter;

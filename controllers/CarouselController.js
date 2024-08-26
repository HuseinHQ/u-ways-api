const { Carousel } = require('../models/index.js');

class CarouselController {
  static async getAllCarousels(req, res, next) {
    try {
      const carousels = await Carousel.findAll();
      res.status(200).json({ data: carousels });
    } catch (err) {
      console.log('----- controllers/CarouselController.js (getAllCarousels) -----\n', err);
      next(err);
    }
  }
}

module.exports = CarouselController;

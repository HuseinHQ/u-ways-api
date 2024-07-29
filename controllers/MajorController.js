const { Major, Sequelize } = require('../models/index');

class MajorController {
  static async getAllMajors(req, res, next) {
    const where = {};
    const { FacultyId, search } = req.query;
    if (FacultyId) {
      where.FacultyId = FacultyId;
    }
    if (search) {
      where.name = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    let data = await Major.findAll({ where });
    data = data.map((el) => ({
      id: el.id,
      FacultyId: el.FacultyId,
      name: el.name,
    }));
    res.json({ data });
    try {
    } catch (err) {
      console.log('----- controllers/MajorController.js (getAllMajors) -----\n', err);
      next(err);
    }
  }
}

module.exports = MajorController;

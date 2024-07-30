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

  static async addMajor(req, res, next) {
    try {
      const { name, FacultyId } = req.body;
      await Major.create({ name, FacultyId });

      res.json({ data: { message: 'Berhasil menambahkan program studi' } });
    } catch (err) {
      console.log('----- controllers/MajorController.js (addMajor) -----\n', err);
      next(err);
    }
  }

  static async bulkDeleteMajor(req, res, next) {
    try {
      const ids = req.body;
      await Major.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: ids,
          },
        },
      });

      res.json({ data: { message: 'Program studi berhasil didelete!' } });
    } catch (err) {
      console.log('----- controllers/MajorController.js (bulkDeleteMajor) -----\n', err);
      next(err);
    }
  }

  static async editMajor(req, res, next) {
    try {
      const { id } = req.params;
      const { name, FacultyId } = req.body;

      const findMajor = await Major.findByPk(id);
      if (!findMajor) {
        throw { name: 'MajorNotFound', data: id };
      }

      await Major.update({ name, FacultyId }, { where: { id } });
      res.json({ data: { message: `Program studi dengan id ${id} berhasil diubah!` } });
    } catch (err) {
      console.log('----- controllers/MajorController.js (editMajor) -----\n', err);
      next(err);
    }
  }
}

module.exports = MajorController;

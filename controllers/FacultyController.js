const { Faculty, Major, Sequelize } = require('../models/index');

class FacultyController {
  static async getAllFaculties(req, res, next) {
    try {
      const { search } = req.query;
      const where = {};
      if (search) {
        where.name = { [Sequelize.Op.iLike]: `%${search}%` };
      }

      let data = await Faculty.findAll({ where, include: [Major], order: [['name', 'ASC']] });
      data = data.map((el) => ({
        id: el.id,
        name: el.name,
        Majors: el.Majors.map((major) => ({
          id: major.id,
          name: major.name,
        })),
      }));
      res.json({ data });
    } catch (err) {
      console.log('----- controllers/FacultyController.js (getAllFaculties) -----\n', err);
      next(err);
    }
  }

  static async addFaculty(req, res, next) {
    try {
      const { name } = req.body;
      await Faculty.create({ name });

      res.json({ data: { message: 'Berhasil menambahkan fakultas' } });
    } catch (err) {
      console.log('----- controllers/FacultyController.js (addFaculty) -----\n', err);
      next(err);
    }
  }

  static async bulkDeleteFaculty(req, res, next) {
    try {
      const ids = req.body;
      await Faculty.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: ids,
          },
        },
      });

      res.json({ data: { message: 'Fakultas berhasil didelete!' } });
    } catch (err) {
      console.log('----- controllers/FacultyController.js (bulkDeleteFaculty) -----\n', err);
      next(err);
    }
  }

  static async editFaculty(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const findFaculty = await Faculty.findByPk(id);
      if (!findFaculty) {
        throw { name: 'FacultyNotFound', data: id };
      }

      await Faculty.update({ name }, { where: { id } });
      res.json({ data: { message: `Fakultas dengan id ${id} berhasil diubah!` } });
    } catch (err) {
      console.log('----- controllers/FacultyController.js (editFaculty) -----\n', err);
      next(err);
    }
  }

  static async deleteFaculty(req, res, next) {
    try {
      const { id } = req.params;
      const findFaculty = await Faculty.findByPk(id);
      if (!findFaculty) {
        throw { name: 'FacultyNotFound' };
      }

      await Faculty.destroy({ where: { id } });

      res.json({ data: { message: `Fakultas ${findFaculty.name} berhasil didelete!` } });
    } catch (err) {
      console.log('----- controllers/FacultyController.js (deleteFaculty) -----\n', err);
      next(err);
    }
  }
}

module.exports = FacultyController;

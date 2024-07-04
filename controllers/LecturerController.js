const { Lecturer, User, Major, Faculty } = require('../models/index');

class LecturerController {
  static async getAllLecturers(req, res, next) {
    try {
      const { FacultyId } = req.query;
      console.log('FacultyId', FacultyId);
      const include = [
        {
          model: User,
        },
      ];

      if (FacultyId) {
        include.push({
          model: Major,
          required: true,
          include: [
            {
              model: Faculty,
              where: { id: FacultyId },
            },
          ],
        });
      }

      let data = await Lecturer.findAll({ include });
      data = data.map((el) => ({
        id: el.id,
        name: el.User.name,
      }));
      res.json({ data });
    } catch (err) {
      console.log('----- controllers/LecturerController.js (getAllLecturers) -----\n', err);
      next(err);
    }
  }
}

module.exports = LecturerController;

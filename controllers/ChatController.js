const { Chat, Lecturer, Student, User, Sequelize, sequelize } = require('../models/index');
const cloudinary = require('../config/cloudinaryConfig');
const { bucket } = require('../config/firebaseConfig');

class ChatController {
  static async getChats(req, res, next) {
    try {
      const { id, role } = req.user;

      const where = role === 'mahasiswa' ? { StudentId: id } : { LecturerId: id };
      let chats = await Chat.findAll({
        where,
        include: [
          { model: Lecturer, include: [User] },
          { model: Student, include: [User] },
        ],
        order: [['updatedAt', 'DESC']],
      });

      chats = chats.map((el) => ({
        chatId: `chat-${el.id}`,
        updatedAt: el.updatedAt,
        user: {
          id: role === 'mahasiswa' ? el.Lecturer.id : el.Student.id,
          [role === 'mahasiswa' ? 'LecturerId' : 'StudentId']: role === 'mahasiswa' ? el.Lecturer.id : el.Student.id,
          name: role === 'mahasiswa' ? el.Lecturer.User.name : el.Student.User.name,
          email: role === 'mahasiswa' ? el.Lecturer.User.email : el.Student.User.email,
        },
      }));
      res.json({ data: chats });
    } catch (err) {
      console.log('----- controllers/ChatController.js (getChats) -----\n', err);
      next(err);
    }
  }

  static async updateChatDate(req, res, next) {
    try {
      const { id } = req.params;
      const { date } = req.body;
      await sequelize.query(`UPDATE "Chats" SET "updatedAt" = :date WHERE "id" = :id`, {
        replacements: { date, id },
        type: Sequelize.QueryTypes.UPDATE,
      });
      res.json({ data: { message: 'Update ChatDate Berhasil' } });
    } catch (err) {
      console.log('----- controllers/ChatController.js (updateChatDate) -----\n', err);
      next(err);
    }
  }

  static async postFile(req, res, next) {
    try {
      const tes = req.files;
      console.log('????', tes);
      const { file } = req.files;
      if (!file) {
        throw { name: 'NoFileUpload' };
      }

      const blob = bucket.file(file.name);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (err) => {
        console.log('----- controllers/ChatController.js (postFile) -----\n', err);
        next(err);
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(201).json({ data: { url } });
      });

      // Ensure the file data is correctly passed to the stream
      blobStream.end(file.data);
    } catch (err) {
      console.log('----- controllers/ChatController.js (postFile) -----\n', err);
      next(err);
    }
  }
}

module.exports = ChatController;

const groupErrors = require('../helpers/groupErrors');

function errorHandler(err, req, res, next) {
  let status = 500;
  let errors = { message: 'Internal Server Error' };

  switch (err.name) {
    case 'ValidationError':
      status = 404;
      errors = err.errors;
      break;
    case 'SequelizeValidationError':
      status = 404;
      errors = groupErrors(err);
      break;
    case 'SequelizeUniqueConstraintError':
      status = 409;
      errors = groupErrors(err);
      break;
    case 'AuthError':
      status = 401;
      errors = { message: 'Email atau Password salah!' };
      break;
    case 'DataComplete':
      status = 401;
      errors = { message: 'Data sudah lengkap!' };
      break;
    case 'SequelizeForeignKeyConstraintError':
      status = 400;
      errors = { code: err.index };
      break;
    case 'SequelizeConnectionRefusedError':
      status = 503;
      errors = { message: 'Koneksi ke Database Error!' };
      break;
    case 'TokenExpiredError':
      status = 401;
      errors = { message: 'Sesi telah berakhir, silakan login ulang!' };
      break;
    case 'JsonWebTokenError':
      status = 401;
      errors = { message: 'Invalid Token!' };
      break;
    case 'Authorization':
      status = 402;
      errors = { message: 'Anda tidak memiliki akses ke halaman ini!' };
      break;
    case 'ArticleNotFound':
      status = 404;
      errors = { message: `Artikel dengan id ${err.data} tidak ditemukan!` };
      break;
    case 'NoImageUpload':
      status = 400;
      errors = { message: 'Tidak ada gambar untuk diupload!' };
      break;
    case 'CloudinaryError':
      status = 500;
      errors = { message: 'Terjadi masalah pada Cloudinary!' };
      break;
    case 'QuestionNotFound':
      status = 404;
      errors = { message: `Question dengan id ${err.data} tidak ditemukan!` };
      break;
    case 'FacultyNotFound':
      status = 404;
      errors = { message: `Fakultas dengan id ${err.data} tidak ditemukan!` };
      break;
    case 'LecturerNotFound':
      status = 404;
      errors = { message: `Dosen dengan id ${err.data} tidak ditemukan!` };
      break;
    case 'StudentNotFound':
      status = 404;
      errors = { message: `Mahasiswa dengan id ${err.data} tidak ditemukan!` };
      break;
    case 'UserNotFound':
      status = 404;
      errors = { message: `User dengan id ${err.data} tidak ditemukan!` };
      break;
    case 'InvalidEmail':
      status = 404;
      errors = { message: 'Format email tidak valid / bukan dari UPN' };
      break;
  }

  console.log(errors);
  res.status(status).json({ errors });
}

module.exports = errorHandler;

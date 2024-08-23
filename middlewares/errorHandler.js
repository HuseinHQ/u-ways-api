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
    case 'NoFileUpload':
      status = 400;
      errors = { message: 'Tidak ada file untuk diupload!' };
      break;
    case 'CloudinaryError':
      status = 500;
      errors = { message: 'Terjadi masalah pada Cloudinary!', detail: err.data };
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
    case 'QuizExist':
      status = 409;
      errors = {
        message: `Kuis dengan semester ${err.data.semester} ${err.data.part === 1 ? 'akhir' : 'awal'} sudah tersedia!`,
      };
      break;
    case 'QuizNotFound':
      status = 404;
      errors = { message: `Kuis ${err.data ? 'dengan id ' + err.data + ' ' : ''}tidak ditemukan!` };
      break;
    case 'StudentOnly':
      status = 401;
      errors = { message: 'Anda bukan mahasiswa!' };
      break;
    case 'NoQuiz':
      status = 401;
      errors = { message: 'Belum ada kuis yang bisa diambil!' };
      break;
    case 'QuizTaken':
      status = 409;
      errors = { message: 'Kuis sudah pernah diambil!' };
      break;
  }

  console.log(errors);
  res.status(status).json({ errors });
}

module.exports = errorHandler;

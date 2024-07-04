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
  }

  res.status(status).json({ errors });
}

module.exports = errorHandler;

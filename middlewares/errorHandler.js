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
    case 'AuthError': {
      status = 401;
      errors = { message: 'Invalid Email or Password' };
    }
  }

  res.status(status).json({ errors });
}

module.exports = errorHandler;

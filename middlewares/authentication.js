const { verifytoken } = require('../helpers/jwt');

function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    const payload = verifytoken(access_token);

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;

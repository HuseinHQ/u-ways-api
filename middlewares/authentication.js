const { verifyToken, createAccessToken, createRefreshToken } = require('../helpers/jwt');

function authentication(req, res, next) {
  try {
    const refresh_token = req.headers['x-refresh-token'];
    const access_token = req.headers['x-access-token'];
    let payload;

    try {
      payload = verifyToken(access_token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshPayload = verifyToken(refresh_token);
        payload = { id: refreshPayload.id, role: refreshPayload.role };
        const newAccessToken = createAccessToken(payload);
        const newRefreshToken = createRefreshToken(payload);
        res.setHeader('access_token', newAccessToken);
        res.setHeader('refresh_token', newRefreshToken);
      } else {
        throw error;
      }
    }

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

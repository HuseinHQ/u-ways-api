const jwt = require('jsonwebtoken');
const moment = require('moment');
const { JWT_SECRET_KEY } = process.env;

const createAccessToken = (payload) => jwt.sign({ ...payload, exp: moment().add(24, 'hour').unix() }, JWT_SECRET_KEY);
const createRefreshToken = (payload) => jwt.sign({ ...payload, exp: moment().add(30, 'days').unix() }, JWT_SECRET_KEY);
const verifyToken = (token) => jwt.verify(token, JWT_SECRET_KEY);

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyToken,
};

const { comparePassword } = require('../helpers/bcrypt');
const checkEmailAndRole = require('../helpers/checkEmailAndRole');
const { createToken } = require('../helpers/jwt');
const { User } = require('../models/index');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password, confirm_password } = req.body;

      if (password !== confirm_password) {
        throw {
          name: 'ValidationError',
          errors: {
            confirm_password: ['PASSWORD_NOT_MATCH'],
          },
        };
      }

      const role = checkEmailAndRole(email);
      if (!role) {
        throw {
          name: 'ValidationError',
          errors: {
            email: ['NOT_UPN'],
          },
        };
      }

      await User.create({ name, email, password, confirm_password, role });

      const loginReq = {
        body: {
          email,
          password,
          fromRegister: true,
        },
      };
      await UserController.login(loginReq, res, next);
    } catch (err) {
      console.log('----- controllers/UserController.js (register) -----\n', err);
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password, fromRegister } = req.body;

      const findUser = await User.findOne({ where: { email } });
      if (!findUser) throw { name: 'AuthError' };

      const isPasswordValid = comparePassword(password, findUser.password);
      if (!isPasswordValid) throw { name: 'AuthError' };

      const payload = { name: findUser.name, role: findUser.role };
      const access_token = createToken(payload);

      res.status(fromRegister ? 201 : 200).json({ data: { access_token, ...payload } });
    } catch (err) {
      console.log('----- controllers/UserController.js (login) -----\n', err);
      next(err);
    }
  }

  static async completeStudentData(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }

  static async completeLecturerData(req, res, next) {}
}

module.exports = UserController;

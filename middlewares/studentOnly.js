function studentOnly(req, res, next) {
  try {
    const { role } = req.user;
    if (role === 'mahasiswa') {
      next();
    } else {
      throw { name: 'StudentOnly' };
    }
  } catch (err) {
    next(err);
  }
}

module.exports = studentOnly;

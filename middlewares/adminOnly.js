function adminOnly(req, res, next) {
  try {
    const { role } = req.user;
    if (role === 'admin') {
      next();
    } else {
      throw { name: 'Authorization' };
    }
  } catch (err) {
    next(err);
  }
}

module.exports = adminOnly;

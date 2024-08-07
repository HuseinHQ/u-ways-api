function pageNotFound(req, res, next) {
  res.status(404).json({ errors: { message: 'page not found' } });
}

module.exports = pageNotFound;

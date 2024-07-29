const AdminController = require('../controllers/AdminController');

const adminRouter = require('express').Router();

adminRouter.get('/dashboard', AdminController.getDashboardData);

module.exports = adminRouter;

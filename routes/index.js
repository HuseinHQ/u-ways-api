const express = require('express');
const userRouter = require('./userRouter');
const router = express.Router();

router.use('/auth', userRouter);

module.exports = router;

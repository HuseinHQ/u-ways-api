const express = require('express');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const facultyRouter = require('./facultyRouter');
const majorRouter = require('./majorRouter');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/faculties', facultyRouter);
router.use('/majors', majorRouter);

module.exports = router;

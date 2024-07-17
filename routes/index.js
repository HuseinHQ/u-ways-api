const express = require('express');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const facultyRouter = require('./facultyRouter');
const majorRouter = require('./majorRouter');
const lecturerRouter = require('./lecturerRouter');
const articleRouter = require('./articleRouter');
const chatRouter = require('./chatRouter');
const studentRouter = require('./studentRouter');
const quizRouter = require('./quizRouter');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/faculties', facultyRouter);
router.use('/majors', majorRouter);
router.use('/lecturers', lecturerRouter);
router.use('/students', studentRouter);
router.use('/articles', articleRouter);
router.use('/chats', chatRouter);
router.use('/quizzes', quizRouter);

module.exports = router;

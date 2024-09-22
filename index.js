require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const fs = require('fs');
const path = require('path');
const pageNotFound = require('./middlewares/pageNotFound');
const app = express();
const PORT = process.env.NODE_LOCAL_PORT || 3000;
const HOST = process.env.NODE_ENV === 'development' ? '0.0.0.0' : process.env.NODE_HOST;
const schedule = require('node-schedule');
const StudentController = require('./controllers/StudentController');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads', 'articles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads/carousels', express.static(path.join(__dirname, 'uploads', 'carousels')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
  })
);

app.use(router);
app.use(pageNotFound);
app.use(errorHandler);

// a schedule to update student semester every end of july and end of january
schedule.scheduleJob('59 23 31 7,1 *', StudentController.incrementAllStudentSemester);

app.listen(PORT, HOST, () => {
  console.log(`App listens to port: ${PORT}`);
});

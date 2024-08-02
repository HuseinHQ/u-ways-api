require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.NODE_LOCAL_PORT || 3000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads', 'articles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use((req, res, next) => {
    req.headers.access_token = req.headers['x-access-token'];
    req.headers.refresh_token = req.headers['x-refresh-token'];
    console.log(req.headers);
    next();
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: uploadDir,
    limits: { fileSize: 2 * 1024 * 1024 },
  })
);

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listens to port: ${PORT}`);
});

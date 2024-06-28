require('dotenv').config();
const express = require('express');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listens to port: ${PORT}`);
});

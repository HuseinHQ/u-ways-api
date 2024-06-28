const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ tes: 'tes' });
});

module.exports = router;

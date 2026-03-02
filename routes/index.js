var express = require('express');
var router = express.Router();
/* GET home page. */
//localhost:3000
router.get('/', function (req, res, next) {
  res.json({ title: 'Express', message: 'Welcome to NNPTUD API' });
});

module.exports = router;

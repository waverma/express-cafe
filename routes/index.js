var express = require('express');
var router = express.Router();


// GET home page.
router.get('/', function(req, res) {
  res.redirect('/cafe/home');
})

router.get('/cafe', function(req, res) {
  res.redirect('/cafe/home');
})

module.exports = router;

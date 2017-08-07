var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

router.post('/newtrip', function(req, res) {
  console.log(req.body);
  
  res.sendStatus(200);
})

module.exports = router;

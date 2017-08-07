var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');

router.post('/newtrip', function(req, res) {
  console.log(req.body);
  requests.newTrip(req.body);
})

module.exports = router;

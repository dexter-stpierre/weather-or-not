var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');
var compare = require('../modules/map.comparisons.js');

router.post('/newtrip', function(req, res) {
  var trip = {};
  console.log(req.body);
  newTrip = req.body;
  requests.newTrip(newTrip);
});



module.exports = router;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');

router.post('/newtrip', function(req, res) {
  var trip = {};
  console.log(req.body);
  trip.route = requests.newTrip(req.body);
  if (trip.route != undefined) {
    console.log(trip);
  }
})

module.exports = router;

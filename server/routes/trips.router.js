var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');
var compare = require('../modules/map.comparisons.js');

router.post('/newtrip', function(req, res) {
  res.setTimeout(600000, function(){
    console.log('request timed out');
    res.send(408);
  })
  var trip = {};
  console.log(req.body);
  newTrip = req.body;
  requests.newTrip(newTrip);
  var checkRequest = setInterval(function(){
    finishedTrip = requests.trip;
    console.log(requests.trip.complete);
    if (finishedTrip.complete == true) {
      console.log('trip complete');
      var tripToSend = {
        route: {
          distance: finishedTrip.route.routeDetails.routes[0].summary.distance,
          duration: finishedTrip.route.durationInHours,
          directions: finishedTrip.route.routeDetails.routes[0].segments[0].steps,
          origin: finishedTrip.route.routeDetails.info.query.coordinates[0],
          destination: finishedTrip.route.routeDetails.info.query.coordinates[1],
          units: finishedTrip.route.routeDetails.info.query.units
        },
        wayPoints: finishedTrip.wayPoints
      }
      res.send(tripToSend);
      clearInterval(checkRequest)
    }
  }, 1000)
});



module.exports = router;

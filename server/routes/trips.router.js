//requires
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');

//post route
router.post('/newtrip', function(req, res) {
  //sets timeout to 10 minutes for especially long trips
  res.setTimeout(600000, function(){
    console.log('request timed out');
    // sends timeout code if it times out
    res.send(408);
  });
  console.log(req.body);
  newTrip = req.body;
  //runs the requests.newTrip function to get route details and array of waypoints
  requests.newTrip(newTrip);
  // creates interval to check if trip calculations are complete
  var checkRequest = setInterval(function(){
    finishedTrip = requests.trip;
    console.log(requests.trip.complete);
    //if the trip is complete it will prepare object and send response
    if (finishedTrip.complete == true) {
      console.log('trip complete');
      //console.log(finishedTrip);
      // prepares object to send to client
      var tripToSend = {
        route: {
          destinationAddress: finishedTrip.destinationAddress,
          originAddress: finishedTrip.originAddress,
          distance: finishedTrip.route.routeDetails.routes[0].summary.distance,
          duration: {totalDuration: finishedTrip.route.durationInHours, hours: finishedTrip.route.travelTime, leftoverMinutes: finishedTrip.route.remainder},
          directions: finishedTrip.route.routeDetails.routes[0].segments[0].steps,
          origin: finishedTrip.route.routeDetails.info.query.coordinates[0],
          destination: finishedTrip.route.routeDetails.info.query.coordinates[1],
          units: finishedTrip.route.routeDetails.info.query.units
        },
        wayPoints: finishedTrip.wayPoints,
        weather: finishedTrip.weather,
        departure: finishedTrip.departure
      }
      //sends trip details
      res.send(tripToSend);
      clearInterval(checkRequest)
    }
  }, 1000)
});


//exports router
module.exports = router;

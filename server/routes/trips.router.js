//requires
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');
var weather = require('../modules/weather-api-requests.js');
var User = require('../models/user.js');

router.delete('/:id', function(req, res){
  console.log(req.params.id);
  var tripToDelete = req.params.id;
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    User.findByIdAndUpdate(req.user._id, {$pull: {trips: {_id: tripToDelete}}}, function(err, success){
      if(err){
        console.log(err);
      } else{
        console.log(success);
        res.sendStatus(200);
      }
    });
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// function(err, user){
//   if(err) {
//     res.sendStatus(500);
//   } else {
//     var deleteThisTrip = user.trips.id(tripToDelete);
//     console.log(deleteThisTrip);
//     user.trips
//     res.send(200);
//   }
// }

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
          originCity: finishedTrip.originCity,
          destinationCity:finishedTrip.destinationCity,
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
      console.log('trip to send', tripToSend);
      res.send(tripToSend);
      clearInterval(checkRequest)
    }
  }, 1000)
});

router.post('/viewSavedTrip', function(req, res){
  console.log('viewSavedTrip', req.body);
  weather.getWeather(req.body);
  var checkRequest = setInterval(function(){
    finishedTrip = req.body;
    if (finishedTrip.complete == true) {
      console.log('finishedTrip', finishedTrip);
      var today = new Date();
      var todayMs = Date.parse(today)
      console.log(todayMs);
      dDate = new Date(finishedTrip.departure.date);
      departureDate = Date.parse(dDate);
      console.log(departureDate);
      console.log(departureDate + 864000000);
      if(departureDate > todayMs && departureDate < todayMs + 864000000){
        console.log('in range');
        var daysUntilDeparture = Math.ceil((departureDate - today) / 86400000);
        console.log(daysUntilDeparture);
        finishedTrip.departure.daysUntilDeparture = daysUntilDeparture;
      }else{
        console.log('out of range');
      }
      console.log('time date', finishedTrip.departure.timeDate);
      var time = new Date(finishedTrip.departure.timeDate);
      console.log(time);
      finishedTrip.departure.time.hours = addZero(time.getHours());
      finishedTrip.departure.time.minutes = addZero(Math.round(time.getMinutes()));
      var departureHours = finishedTrip.departure.time.hours
      var times = [{hours: departureHours, minutes: finishedTrip.departure.time.minutes, daysUntilDeparture: daysUntilDeparture}];
      while(times.length < finishedTrip.weather.length - 1) {
        departureHours += 1;
        if (departureHours == 24) {
          departureHours = 0;
          daysUntilDeparture += 1;
        }
        if (finishedTrip.departure.time.minutes >= 60) {
          finishedTrip.departure.time.minutes -= 60;
          departureHours += 1;
        }
        times.push({hours: departureHours, minutes: finishedTrip.departure.time.minutes, daysUntilDeparture: daysUntilDeparture});
      }
      times.push({hours: departureHours, minutes: addZero(Math.round(finishedTrip.route.duration.leftoverMinutes)), daysUntilDeparture: daysUntilDeparture})
      finishedTrip.times = times;
      console.log('sending trip', finishedTrip);
      res.send(finishedTrip);
      clearInterval(checkRequest);
    }
  })
});

function addZero(time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
}

//exports router
module.exports = router;

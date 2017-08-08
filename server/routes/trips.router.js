var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var requests = require('../modules/api.requests.js');
var when = require('when');

router.post('/newtrip', function(req, res) {
  var loop = 0;
  var trip = {};
  console.log(req.body);
  newTrip = req.body;
  // trip.route = requests.newTrip(req.body);
  // if (trip.route != undefined) {
  //   console.log(trip);
  // }
  requests.newTrip(newTrip);
  var checkApi = setInterval(function(){
    loop ++;
    console.log('interval');
    if(requests.route != undefined && requests.route.error == false){
      if(requests.distanceIsochrone != undefined && requests.distanceIsochrone.error == false){
        if(requests.timeIsochrone != undefined && requests.timeIsochrone.error == false){
          console.log('api request complete');
          // console.log(requests.timeIsochrone);
          // console.log(requests.distanceIsochrone);
          // console.log(requests.route);
          clearInterval(checkApi);
        }
      }
    } else if (requests.route != undefined && requests.route.error == true) {
      console.log('route request failure');
      console.log(requests.route.message);
    } else if (requests.distanceIsochrone != undefined && requests.distanceIsochrone.error == true) {
      console.log('distanceIsochrone request failure');
      console.log(requests.distanceIsochrone.message);
    } else if (requests.timeIsochrone != undefined && requests.timeIsochrone.error == true) {
      console.log('timeIsochrone request failure');
      console.log(requests.timeIsochrone.message);
    }
    else if(loop > 30){
      console.log("api failure");
      clearInterval(checkApi);
    }
  }, 1000)
});

function logThis(){
  console.log('this should be last');
}

module.exports = router;

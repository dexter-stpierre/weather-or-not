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
  getPolylines(newTrip)
});

function getPolylines(newTrip) {
  var loop = 0;
  requests.newTrip(newTrip);
  var checkApi = setInterval(function(){
    loop ++;
    console.log('interval');
    if(requests.route != undefined && requests.route.error == false){
      if(requests.distanceIsochrone != undefined && requests.distanceIsochrone.error == false){
        if(requests.timeIsochrone != undefined && requests.timeIsochrone.error == false){
          console.log('api request complete');
          console.log(requests.route.polyline);
          console.log(requests.distanceIsochrone.polyline);
          console.log(requests.timeIsochrone.polyline);
          compare.compareApiResults(requests.route.polyline, requests.distanceIsochrone.polyline, requests.timeIsochrone.polyline)
          clearInterval(checkApi);
        }
      }
    } else if (requests.route != undefined && requests.route.error == true) {
      console.log('route request failure');
      console.log(requests.route.message);
      clearInterval(checkApi);
    } else if (requests.distanceIsochrone != undefined && requests.distanceIsochrone.error == true) {
      console.log('distanceIsochrone request failure');
      console.log(requests.distanceIsochrone.message);
      clearInterval(checkApi);
    } else if (requests.timeIsochrone != undefined && requests.timeIsochrone.error == true) {
      console.log('timeIsochrone request failure');
      console.log(requests.timeIsochrone.message);
      clearInterval(checkApi);
    }
    else if(loop > 30){
      console.log("api failure");
      clearInterval(checkApi);
    }
  }, 1000)
}

module.exports = router;

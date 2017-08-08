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
    if(requests.route != undefined){
      if(requests.distancePolyline != undefined){
        if(requests.timePolyline != undefined){
          console.log('api request complete');
          clearInterval(checkApi);
        }
      }
    } //else if (requests.route) {

    //}
    else if(loops > 30){
      console.log("api failure");
      clearInterval(checkApi);
    }
  }, 1000)
});

function logThis(){
  console.log('this should be last');
}

module.exports = router;

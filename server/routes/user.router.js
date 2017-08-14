var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username : req.user.username,
      trips: req.user.trips
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

//save trip
router.put('/saveNewTrip', function(req, res){
  //console.log(req.body);
  var newTrip = req.body;
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    User.findById(
      req.user._id,
      function(err, user) {
      if(err) {
        res.send(false);
      } else {
        user.trips.push(newTrip);
        user.save(function(err){
          if(err) {
            res.send(false);
          } else {
            res.sendStatus(200);
          }
        })
      }
  })
  //res.sendStatus(200)
}else{
  res.send('not logged in')
}})

module.exports = router;

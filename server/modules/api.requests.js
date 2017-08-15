//requires
var https = require('https');
var compare = require('./map.comparisons.js');
var openRoute = require('../api-keys/open-route-services-api.js');
var weather = require('./weather-api-requests.js');

//define global variables
var i;
var wayPoints = [];

//Create module object
var requests = {
  //funtion to create the trip to send to client
  newTrip: function(newTrip) {
    console.log(newTrip);
    //gets the first set of polylines (needs special function because route only needs to be requested once)
    getFirstPolylines(newTrip);
    //ensures
    firstConnectionToApi(newTrip);
    //interval that checks to see if the request is finished
    var checkTrip = setInterval(function(){
      if (requests.trip.complete == true) {
        console.log("completed check");
        //console.log(requests.trip);
        clearInterval(checkTrip);
        return requests.trip;
      }
    }, 1000)
  }
};

//function to get the first isochrone polylines and the route
function getFirstPolylines(newTrip) {
  //creates a trip with a property of complete that equals false to prevent res.send from running early and waypoints to an array with the origin coordinate
  requests.trip = {
    complete: false,
    wayPoints: [newTrip.origin],
    departure: newTrip.departure,
    originAddress: newTrip.originAddress,
    destinationAddress: newTrip.destinationAddress
  };
  // resets loop to 0 for the timeout for the api calls
  var loop = 0;
  //set interval to check if first round of api calls are complete
  var checkApi = setInterval(function(){
    //add one to loop for timeout
    loop ++;
    console.log('interval');
    //check if route exists and if it had no error
    if(requests.trip.route != undefined && requests.trip.route.error == false){
      //check if distanceIsochrone exists and if it had no error
      if(requests.trip.distanceIsochrone != undefined && requests.trip.distanceIsochrone.error == false){
        //check if timeIsochrone exists and if it had no error
        if(requests.trip.timeIsochrone != undefined && requests.trip.timeIsochrone.error == false){
          //if all three are done this function will run
          console.log('api request complete');
          console.log(requests.trip.route.travelTime);
          console.log('requests.trip.wayPoints', requests.trip.wayPoints);
          //reset i for the loop
          i = 0;
          // run a custom loop that finds all of the way points needed
          myLoop(requests,newTrip)
          console.log('requests.trip.wayPoints', requests.trip.wayPoints);
          //clear the interval
          clearInterval(checkApi);
        }
      }
    }
    //error handling
    else if (requests.trip.route != undefined && requests.trip.route.error == true) {
      console.log('route request failure');
      console.log(requests.trip.route.message);
      clearInterval(checkApi);
    } else if (requests.trip.distanceIsochrone != undefined && requests.trip.distanceIsochrone.error == true) {
      console.log('distanceIsochrone request failure');
      console.log(requests.trip.distanceIsochrone.message);
      clearInterval(checkApi);
    } else if (requests.trip.timeIsochrone != undefined && requests.trip.timeIsochrone.error == true) {
      console.log('timeIsochrone request failure');
      console.log(requests.trip.timeIsochrone.message);
      clearInterval(checkApi);
    }
    //error handling for timeouts
    else if(loop > 30){
      console.log("api failure");
      clearInterval(checkApi);
    }
  }, 1000)
}

//function to get and just isochrones from api
function loopConnectionToApi(origin){
  console.log('loopConnectionToApi');
  console.log(origin);
  getDistancePolyline(origin);
  getTimePolyline(origin);
}

//custom made loop to get and compare polylines as long as the waypoint array is less than or equal to the travel time
function myLoop(requests, newTrip){
  console.log('requests.trip.wayPoints.length: ', requests.trip.wayPoints.length);
  //if the waypoints array is less than or equal to the travel time it will find and compare the polylines
  if (requests.trip.wayPoints.length <= requests.trip.route.travelTime) {
    // sets i the last index of the waypoints array
    i = requests.trip.wayPoints.length - 1;
    // resets the isochrones to undefined to prepare to run through the check
    requests.trip.distanceIsochrone = undefined;
    requests.trip.timeIsochrone = undefined;
    console.log('i = ', i);
    console.log(requests.trip.wayPoints);
    //gets the polylines
    getLoopPolylines(newTrip);
    //checks if polylines have been recieved and compares them
    loopConnectionToApi(requests.trip.wayPoints[i])
  }
  //When all of the way points are found this pushes the destination to the end of the wayPoints array and sets the trip to complete
  else {
    console.log('check complete');
    console.log(newTrip);
    requests.trip.wayPoints.push(newTrip.destination);
    console.log(requests.trip.wayPoints);
    console.log(requests.trip.wayPoints.length);
    //sets the trip to complete so that the response will be sent
    weather.getWeather(requests.trip);
  }
}

//checks if the results of the polylines have been recieved and runs the compare function
function getLoopPolylines(newTrip){
  //resets loop2 for the timeout
  var loop2 = 0;
  console.log('getLoopPolylines');
  //sets interval to check if the isochrones have been recieved
  var loopPolylineCheck = setInterval(function(){
    console.log('interval');
    //checks if distance isochrone has been defined and if there was an error
    if(requests.trip.distanceIsochrone != undefined && requests.trip.distanceIsochrone.error == false){
      //checks if the time isochrone has been defined and if there is an error
      if(requests.trip.timeIsochrone != undefined && requests.trip.timeIsochrone.error == false){
        console.log('api request complete');
        // console.log(requests.route.polyline);
        // console.log(requests.distanceIsochrone.polyline);
        // console.log(requests.timeIsochrone.polyline);
        console.log(requests.trip.route.travelTime);
        var usefulCoordinate = compare.compareApiResults(requests.trip.route.polyline, requests.trip.distanceIsochrone.polyline, requests.trip.timeIsochrone.polyline, requests.trip.wayPoints[requests.trip.wayPoints.length - 1]);
        //console.log('usefulCoordinate', usefulCoordinate);
        requests.trip.wayPoints.push(usefulCoordinate);
        console.log('requests.trip.wayPoints', requests.trip.wayPoints);
        myLoop(requests, newTrip);
        clearInterval(loopPolylineCheck);
      }
    }
    //error handling
    else if (requests.trip.distanceIsochrone != undefined && requests.trip.distanceIsochrone.error == true) {
      console.log('distanceIsochrone request failure');
      console.log(requests.trip.distanceIsochrone.message);
      clearInterval(loopPolylineCheck);
    } else if (requests.trip.timeIsochrone != undefined && requests.trip.timeIsochrone.error == true) {
      console.log('timeIsochrone request failure');
      console.log(requests.trip.timeIsochrone.message);
      clearInterval(loopPolylineCheck);
    }
    //timeout check
    else if(loop2 > 30){
      console.log("api failure");
      clearInterval(loopPolylineCheck);
    }
  }, 1000)
}

//runs the functions to make the first check to the api with the route
function firstConnectionToApi(newTrip){
  console.log(newTrip);
  getRouteDetails(newTrip);
  getTimePolyline(newTrip.origin);
  getDistancePolyline(newTrip.origin);
}

//makes the request to the api for the distance polyline
function getDistancePolyline(origin) {
  console.log('ditance polyline');
  console.log(origin);
  //defines the api request
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=' + origin[0] + '%2C%20' + origin[1] + '&profile=driving-car&range_type=distance&range=60&units=mi&location_type=start&attributes=reachfactor&intersections=false&api_key=' + openRoute.key;
  //makes the api request for the distance polyline
  https.get(apiRequest, function(res){
    // sets the status code and contentType to variables so that it can check for success and proper format
    var { statusCode } = res;
    var contentType = res.headers['content-type'];
    console.log('statusCode', statusCode);
    console.log('contentType', contentType);
    var error;
    //Checks for success code
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
      // sets distanceIsochrone.error to true
      requests.trip.distanceIsochrone = {error: true, message: statusCode};
    }
    //checks for json format
    else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      // sets distanceIsochrone.error to true
      requests.trip.distanceIsochrone = {error: true, message: contentType};
    }
    // checks for error
    if (error) {
      console.error(error.message);
      // sets distanceIsochrone.error to true
      requests.trip.distanceIsochrone = {error: true, message: error.message};
      // consume response data to free up memory
      res.resume();
      return;
    }
    // sets response to a variable so it can be parsed
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) { rawData += chunk; });
    res.on('end', function() {
      try {
        //parses data to js object
        var parsedData = JSON.parse(rawData);
        // creates distance isochrone for the compare function to use
        requests.trip.distanceIsochrone = {
          type: 'distance',
          error: false,
          isochroneDetails: parsedData,
          polyline: parsedData.features[0].geometry.coordinates[0]
        };
      }
      //error handling
      catch (e) {
        console.error(e.message);
        requests.trip.distanceIsochrone = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    requests.trip.distanceIsochrone = {error: true, message: e.message};
  });
}

//gets timepolyline from api to compare
function getTimePolyline(origin){
  console.log('time polyline');
  console.log(origin);
  // sets the api request
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=' + origin[0] + '%2C%20' + origin[1] + '&profile=driving-car&range_type=time&range=3600&location_type=start&attributes=area&intersections=false&id=1&api_key=' + openRoute.key;
  //makes the request to the api for the timepolyline
  https.get(apiRequest, function(res){
    //sets the statusCode and contentType to variables for error checks
    var { statusCode } = res;
    var contentType = res.headers['content-type'];
    console.log('statusCode', statusCode);
    console.log('contentType', contentType);
    var error;
    //checks for success code
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
      // sets timeIsochrone.error to true
      requests.trip.timeIsochrone = {error: true, message: statusCode};
    }
    //checks for proper contentType
    else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      // sets timeIsochrone.error to true
      requests.trip.timeIsochrone = {error: true, message: contentType};
    }
    //error handling
    if (error) {
      console.error(error.message);
      // sets timeIsochrone.error to true
      requests.trip.timeIsochrone = {error: true, message: error.message};
      // consume response data to free up memory
      res.resume();
      return;
    }
    // sets response to a variable
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) { rawData += chunk; });
    res.on('end', function() {
      try {
        //parses data to a js object
        var parsedData = JSON.parse(rawData);
        //console.log('timeIsochrone', parsedData.features[0].geometry.coordinates);
        trip = parsedData;
        //defines timeIsochrone to be passed into compare function
        requests.trip.timeIsochrone = {
          type: 'time',
          error: false,
          isochroneDetails: parsedData,
          polyline: parsedData.features[0].geometry.coordinates[0]
        };
      }
      //error handling
      catch (e) {
        console.error(e.message);
        // sets timeIsochrone.error to true
        requests.trip.timeIsochrone = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    // sets timeIsochrone.error to true
    requests.trip.timeIsochrone = {error: true, message: e.message};
  });
}

//gets details about the route
function getRouteDetails(trip) {
  console.log('route');
  //set origin and destination variables
  var origin = trip.origin;
  var destination = trip.destination;
  console.log(origin, destination);
  var apiRequest = 'https://api.openrouteservice.org/directions?coordinates=' + trip.origin[0] + '%2C%20' + trip.origin[1] + '|' + trip.destination[0] + '%2C%20' + trip.destination[1] + '&profile=driving-car&preference=fastest&units=mi&language=en&geometry=true&geometry_format=geojson&geometry_simplify=false&instructions=true&instructions_format=text&elevation=false&options=%7B%7D&api_key=' + openRoute.key;
  //make api request for the route
  https.get(apiRequest, function(res){
    //sets the statusCode and contentType to variables for error checks
    var { statusCode } = res;
    var contentType = res.headers['content-type'];
    console.log('statusCode', statusCode);
    console.log('contentType', contentType);
    var error;
    //checks for success code
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
      // sets route.error to true
      requests.trip.route = {error: true, message: statusCode};
    }
    // checks for right contentType
    else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      // sets route.error to true
      requests.trip.route = {error: true, message: contentType};
    }
    //error handling
    if (error) {
      console.error(error.message);
      // sets route.error to true
      requests.trip.route = {error: true, message: error.message};
      // consume response data to free up memory
      res.resume();
      return;
    }
    // sets response to a variable
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) { rawData += chunk; });
    res.on('end', function() {
      try {
        //parses data to a js object
        var parsedData = JSON.parse(rawData);
        // gets the durration (recieved in seconds)
        var timeInSeconds = parsedData.routes[0].summary.duration;
        // converts duration to minutes
        var timeInMinutes = timeInSeconds / 60;
        // converts durration to hours
        var travelTime = timeInMinutes / 60;
        // finds the extra minues past the hour
        var remainderInMinutes = timeInMinutes % 60;
        //finds the hours of the travel time
        var timeInHours = (timeInMinutes - remainderInMinutes) / 60;
        // converts remainder to hours
        var remainder = remainderInMinutes / 60;
        console.log('timeInHours', timeInHours);
        console.log('remainder', remainder);
        //sets up the route object to be compared
        requests.trip.route = {
          durationInHours: travelTime,
          error: false,
          polyline: parsedData.routes[0].geometry.coordinates,
          routeDetails: parsedData,
          travelTime: timeInHours,
          remainder: remainderInMinutes
        };
      }
      //error handling
      catch (e) {
        console.error(e.message);
        // sets route.error to true
        requests.trip.route = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error('Got error:', e.message);
    // sets route.error to true
    requests.trip.route = {error: true, message: e.message};
  });
}

//export module
module.exports = requests;

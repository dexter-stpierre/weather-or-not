//requires
var https = require('https');
var {URL} = require('url');
var compare = require('./map.comparisons.js');

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
    wayPoints: [newTrip.origin]
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
    else if(loop > 30){
      console.log("api failure");
      clearInterval(checkApi);
    }
  }, 1000)
}

function loopConnectionToApi(origin){
  console.log('loopConnectionToApi');
  console.log(origin);
  getDistancePolyline(origin);
  getTimePolyline(origin);
}

function myLoop(requests, newTrip){
  console.log('requests.trip.wayPoints.length: ', requests.trip.wayPoints.length);
  if (requests.trip.wayPoints.length <= requests.trip.route.travelTime) {
    i = requests.trip.wayPoints.length - 1;
    requests.trip.distanceIsochrone = undefined;
    requests.trip.timeIsochrone = undefined;
    console.log('i = ', i);
    console.log(requests.trip.wayPoints);
    getLoopPolylines(newTrip);
    loopConnectionToApi(requests.trip.wayPoints[i])
  } else {
    console.log('check complete');
    console.log(newTrip);
    requests.trip.wayPoints.push(newTrip.destination);
    console.log(requests.trip.wayPoints);
    console.log(requests.trip.wayPoints.length);
    requests.trip.complete = true;
  }
  i++
}

function getLoopPolylines(newTrip){
  var loop2 = 0;
  console.log('getLoopPolylines');
  var loopPolylineCheck = setInterval(function(){
    console.log('interval');
    if(requests.trip.distanceIsochrone != undefined && requests.trip.distanceIsochrone.error == false){
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
        myLoop(requests, newTrip)
        clearInterval(loopPolylineCheck);
      }
    } else if (requests.trip.route != undefined && requests.trip.route.error == true) {
      console.log('route request failure');
      console.log(requests.trip.route.message);
      clearInterval(loopPolylineCheck);
    } else if (requests.trip.distanceIsochrone != undefined && requests.trip.distanceIsochrone.error == true) {
      console.log('distanceIsochrone request failure');
      console.log(requests.trip.distanceIsochrone.message);
      clearInterval(loopPolylineCheck);
    } else if (requests.trip.timeIsochrone != undefined && requests.trip.timeIsochrone.error == true) {
      console.log('timeIsochrone request failure');
      console.log(requests.trip.timeIsochrone.message);
      clearInterval(loopPolylineCheck);
    }
    else if(loop2 > 30){
      console.log("api failure");
      clearInterval(loopPolylineCheck);
    }
  }, 1000)
}

function firstConnectionToApi(newTrip){
  console.log(newTrip);
  getRouteDetails(newTrip);
  getTimePolyline(newTrip.origin);
  getDistancePolyline(newTrip.origin);
}

function getDistancePolyline(origin) {
  console.log('ditance polyline');
  console.log(origin);
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=' + origin[0] + '%2C%20' + origin[1] + '&profile=driving-car&range_type=distance&range=60&units=mi&location_type=start&attributes=reachfactor&intersections=false&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
  https.get(apiRequest, function(res){
    var { statusCode } = res;
    var contentType = res.headers['content-type'];
    console.log('statusCode', statusCode);
    console.log('contentType', contentType);
    //console.log(res);

    var error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
      requests.trip.distanceIsochrone = {error: true, message: statusCode};
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      requests.trip.distanceIsochrone = {error: true, message: contentType};
    }
    if (error) {
      console.error(error.message);
      requests.trip.distanceIsochrone = {error: true, message: error.message};
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) { rawData += chunk; });
    res.on('end', function() {
      try {
        var parsedData = JSON.parse(rawData);
        //console.log('distancePolyline', parsedData.features[0].geometry.coordinates);
        trip = parsedData;
        requests.trip.distanceIsochrone = {
          type: 'distance',
          error: false,
          isochroneDetails: parsedData,
          polyline: parsedData.features[0].geometry.coordinates[0]
        };
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.trip.distanceIsochrone = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    requests.trip.distanceIsochrone = {error: true, message: e.message};
  });
}

function getTimePolyline(origin){
  console.log('time polyline');
  console.log(origin);
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=' + origin[0] + '%2C%20' + origin[1] + '&profile=driving-car&range_type=time&range=3600&location_type=start&attributes=area&intersections=false&id=1&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
  var requestUrl = new URL(apiRequest)
  https.get(apiRequest, function(res){
    var { statusCode } = res;
    var contentType = res.headers['content-type'];
    console.log('statusCode', statusCode);
    console.log('contentType', contentType);
    //console.log(res);

    var error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
      requests.trip.timeIsochrone = {error: true, message: statusCode};
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      requests.trip.timeIsochrone = {error: true, message: contentType};
    }
    if (error) {
      console.error(error.message);
      requests.trip.timeIsochrone = {error: true, message: error.message};
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) { rawData += chunk; });
    res.on('end', function() {
      try {
        var parsedData = JSON.parse(rawData);
        //console.log('timeIsochrone', parsedData.features[0].geometry.coordinates);
        trip = parsedData;
        requests.trip.timeIsochrone = {
          type: 'time',
          error: false,
          isochroneDetails: parsedData,
          polyline: parsedData.features[0].geometry.coordinates[0]
        };
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.trip.timeIsochrone = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    requests.trip.timeIsochrone = {error: true, message: e.message};
  });
}

function getRouteDetails(trip) {
  console.log('route');
  var origin = trip.origin;
  var destination = trip.destination;
  console.log(origin, destination);
  var apiRequest = 'https://api.openrouteservice.org/directions?coordinates=' + trip.origin[0] + '%2C%20' + trip.origin[1] + '|' + trip.destination[0] + '%2C%20' + trip.destination[1] + '&profile=driving-car&preference=fastest&units=mi&language=en&geometry=true&geometry_format=geojson&geometry_simplify=false&instructions=true&instructions_format=text&elevation=false&options=%7B%7D&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
  var requestUrl = new URL(apiRequest)
  https.get(apiRequest, function(res){
    var { statusCode } = res;
    var contentType = res.headers['content-type'];
    console.log('statusCode', statusCode);
    console.log('contentType', contentType);
    //console.log(res);

    var error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
      requests.trip.route = {error: true, message: statusCode};
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      requests.trip.route = {error: true, message: contentType};
    }
    if (error) {
      console.error(error.message);
      requests.trip.route = {error: true, message: error.message};
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function(chunk) { rawData += chunk; });
    res.on('end', function() {
      try {
        var parsedData = JSON.parse(rawData);
        //console.log('route', parsedData.routes[0].geometry.coordinates);
        var timeInSeconds = parsedData.routes[0].summary.duration;
        var timeInMinutes = timeInSeconds / 60;
        var travelTime = timeInMinutes / 60;
        var remainderInMinutes = timeInMinutes % 60;
        var timeInHours = (timeInMinutes - remainderInMinutes) / 60;
        var remainder = remainderInMinutes / 60;
        console.log('timeInHours', timeInHours);
        console.log('remainder', remainder);
        requests.trip.route = {
          durationInHours: travelTime,
          error: false,
          polyline: parsedData.routes[0].geometry.coordinates,
          routeDetails: parsedData,
          travelTime: timeInHours
        };
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.trip.route = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error('Got error:', e.message);
    requests.trip.route = {error: true, message: e.message};
  });
}

module.exports = requests;

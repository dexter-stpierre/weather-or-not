var https = require('https');
var {URL} = require('url');
var compare = require('./map.comparisons.js')
//var compare = require('map.comparisons.js');

var requests = {
  newTrip: function(newTrip) {
    //console.log(newTrip);
    getFirstPolylines(newTrip);
    firstConnectionToApi(newTrip);
    //res.sendStatus(200);
  }
};

function getFirstPolylines(newTrip) {
  var loop = 0;
  var checkApi = setInterval(function(){
    loop ++;
    console.log('interval');
    if(requests.route != undefined && requests.route.error == false){
      if(requests.distanceIsochrone != undefined && requests.distanceIsochrone.error == false){
        if(requests.timeIsochrone != undefined && requests.timeIsochrone.error == false){
          console.log('api request complete');
          // console.log(requests.route.polyline);
          // console.log(requests.distanceIsochrone.polyline);
          // console.log(requests.timeIsochrone.polyline);
          console.log(requests.route.travelTime);
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

function firstConnectionToApi(newTrip){
  console.log(newTrip);
  getRouteDetails(newTrip);
  getTimePolyline(newTrip.origin);
  getDistancePolyline(newTrip.origin);
}

function getDistancePolyline(origin) {
  console.log('ditance polyline');
  //console.log(origin);
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=' + origin.x + '%2C%20' + origin.y + '&profile=driving-car&range_type=distance&range=60&units=mi&location_type=start&attributes=reachfactor&intersections=false&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
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
      requests.distanceIsochrone = {error: true, message: statusCode};
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      requests.distanceIsochrone = {error: true, message: contentType};
    }
    if (error) {
      console.error(error.message);
      requests.distanceIsochrone = {error: true, message: error.message};
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
        requests.distanceIsochrone = {type: 'distance', error: false, isochroneDetails: parsedData, polyline: parsedData.features[0].geometry.coordinates[0]};
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.distanceIsochrone = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    requests.distanceIsochrone = {error: true, message: e.message};
  });
}

function getTimePolyline(origin){
  console.log('time polyline');
  //console.log(origin);
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=' + origin.x + '%2C%20' + origin.y + '&profile=driving-car&range_type=time&range=3600&location_type=start&attributes=area&intersections=false&id=1&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
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
      requests.timeIsochrone = {error: true, message: statusCode};
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      requests.timeIsochrone = {error: true, message: contentType};
    }
    if (error) {
      console.error(error.message);
      requests.timeIsochrone = {error: true, message: error.message};
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
        requests.timeIsochrone = {type: 'time', error: false, isochroneDetails: parsedData, polyline: parsedData.features[0].geometry.coordinates[0]};
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.timeIsochrone = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    requests.timeIsochrone = {error: true, message: e.message};
  });
}

function getRouteDetails(trip) {
  console.log('route');
  var origin = trip.origin;
  var destination = trip.destination;
  var apiRequest = 'https://api.openrouteservice.org/directions?coordinates=' + trip.origin.x + '%2C%20' + trip.origin.y + '|' + trip.destination.x + '%2C%20' + trip.destination.y + '&profile=driving-car&preference=fastest&units=mi&language=en&geometry=true&geometry_format=geojson&geometry_simplify=false&instructions=true&instructions_format=text&elevation=false&options=%7B%7D&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
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
      requests.route = {error: true, message: statusCode};
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
      requests.route = {error: true, message: contentType};
    }
    if (error) {
      console.error(error.message);
      requests.route = {error: true, message: error.message};
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
        requests.route = {error: false, polyline: parsedData.routes[0].geometry.coordinates, routeDetails: parsedData, travelTime: timeInHours};
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.route = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error('Got error:', e.message);
    requests.route = {error: true, message: e.message};
  });
}

module.exports = requests;

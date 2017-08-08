var https = require('https');
var {URL} = require('url');
//var compare = require('map.comparisons.js');

var requests = {
  newTrip: function(newTrip) {
    console.log(newTrip);
    connectToApi(newTrip)
    //res.sendStatus(200);
  }
};

function connectToApi(newTrip){
  getRouteDetails(newTrip);
  getTimePolyline(newTrip);
  getDistancePolyline(newTrip);
}

function getDistancePolyline(trip) {
  console.log('ditance polyline');
  var origin = trip.origin;
  var destination = trip.destination;
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=-93.266563%2C%2044.96313&profile=driving-car&range_type=distance&range=60&units=mi&location_type=start&attributes=reachfactor&intersections=false&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
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

function getTimePolyline(trip){
  console.log('time polyline');
  var origin = trip.origin;
  var destination = trip.destination;
  var apiRequest = 'https://api.openrouteservice.org/isochrones?locations=-93.266563%2C%2044.96313&profile=driving-car&range_type=time&range=3600&location_type=start&attributes=area&intersections=false&id=1&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
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
  var apiRequest = 'https://api.openrouteservice.org/directions?coordinates=-93.266563%2C%2044.96313|-98.380429%2C%2038.500327&profile=driving-car&preference=fastest&units=mi&language=en&geometry=true&geometry_format=geojson&geometry_simplify=false&instructions=true&instructions_format=text&elevation=false&options=%7B%7D&api_key=58d904a497c67e00015b45fc53fc79a8d4d54f1553a173972136a622';
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
        trip = parsedData;
        requests.route = {error: false, polyline: parsedData.routes[0].geometry.coordinates, routeDetails: parsedData};
        // compare.compareApiResults();
      } catch (e) {
        console.error(e.message);
        requests.route = {error: true, message: e.message};
      }
    });
  }).on('error', function(e) {
    console.error(`Got error: ${e.message}`);
    requests.route = {error: true, message: e.message};
  });
}

module.exports = requests;

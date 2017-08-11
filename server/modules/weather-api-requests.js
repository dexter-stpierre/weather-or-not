//requires
var https = require('https');
var apixu = require('../api-keys/apixu.js');
var requests = require('./api.requests.js')

var i

//module
weather = {
  getWeather: function(trip) {
    console.log('getWeather');
    i = 0;
    trip.weather = [];
    var checkWeather = setInterval(function(){
      console.log('checkWeather');
      if (trip.weather.length == trip.wayPoints.length) {
        console.log('weather gotten');
        trip.complete = true;
        clearInterval(checkWeather);
      }
    }, 1000);
    weatherLoop(trip);
  }
}

function weatherLoop(trip) {
  if (trip.weather.length < trip.wayPoints.length) {
    var wayPoint = trip.wayPoints[i];
    console.log(wayPoint);
    var apiRequest = 'https://api.apixu.com/v1/forecast.json?key=' + apixu.key + '&q=' + wayPoint[1] + ',' + wayPoint[0] + '&days=10';
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
        trip.weather.push({error: true, message: statusCode});
      }
      //checks for proper contentType
      else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
        // sets timeIsochrone.error to true
        trip.weather.push({error: true, message: contentType});
      }
      //error handling
      if (error) {
        console.error(error.message);
        // sets timeIsochrone.error to true
        trip.weather.push({error: true, message: error.message});
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
          console.log('weather found');
          //console.log('timeIsochrone', parsedData.features[0].geometry.coordinates);
          //defines timeIsochrone to be passed into compare function
          trip.weather.push({error: false, weatherData: parsedData});
          i += 1;
          weatherLoop(trip);
        }
        //error handling
        catch (e) {
          console.error(e.message);
          // sets timeIsochrone.error to true
          trip.weather.push({error: true, message: e.message});
        }
      });
    }).on('error', function(e) {
      console.error(`Got error: ${e.message}`);
      // sets timeIsochrone.error to true
      trip.weather.push({error: true, message: e.message});
    });
  }
}

//export module
module.exports = weather;

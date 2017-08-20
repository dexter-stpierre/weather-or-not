myApp.factory('Trip', function($http, $location, UserService){
  console.log('TripService Loaded');
  var userService = UserService;
  console.log(userService);
  var TripService = {
    submitNewTrip: function(newTrip) {
      console.log(newTrip);
      // gets origin and destination coordinates and prepares them to go into object
      var originAddressY = newTrip.originDetails.geometry.viewport.b.b.toPrecision(6);
      var originAddressX = newTrip.originDetails.geometry.viewport.f.f.toPrecision(6);
      var destinationAddressY = newTrip.destinationDetails.geometry.viewport.b.b.toPrecision(6);
      var destinationAddressX = newTrip.destinationDetails.geometry.viewport.f.f.toPrecision(6);
      //prepares object to send to server
      var tripToSend = {
        originCity: newTrip.originCity,
        destinationCity: newTrip.destinationCity,
        originAddress: newTrip.originAddress,
        destinationAddress: newTrip.destinationAddress,
        originDetails: newTrip.originDetails,
        destinationDetails: newTrip.destinationDetails,
        origin: [originAddressY, originAddressX],
        destination: [destinationAddressY, destinationAddressX],
        departure: {
          date: newTrip.departure.date,
          timeDate: newTrip.departure.timeDate
        }
      }
      console.log(tripToSend);
      // sets 10 minute timeout for request
      var postConfig = {
        timeout: 600000
      }
      console.log(postConfig);
      TripService.calculatingResults = true;
      //makes post request to server
      $http.post('/trips/newtrip', tripToSend, postConfig).then(function(response){
        console.log(response);
        TripService.newTrip = response.data;
        var today = new Date();
        var todayMs = Date.parse(today)
        console.log(todayMs);
        departureDate = Date.parse(TripService.newTrip.departure.date);
        console.log(departureDate);
        console.log(departureDate + 864000000);
        if(departureDate > todayMs && departureDate < todayMs + 864000000){
          console.log('in range');
          var daysUntilDeparture = Math.ceil((departureDate - today) / 86400000);
          console.log(daysUntilDeparture);
          TripService.newTrip.departure.daysUntilDeparture = daysUntilDeparture;
        }else{
          console.log('out of range');
        }
        var time = new Date(TripService.newTrip.departure.timeDate);
        TripService.newTrip.departure.time= {};
        TripService.newTrip.departure.time.hours = addZero(time.getHours());
        TripService.newTrip.departure.time.minutes = addZero(Math.round(time.getMinutes()));
        var departureHours = TripService.newTrip.departure.time.hours
        var times = [{hours: departureHours, minutes: TripService.newTrip.departure.time.minutes, daysUntilDeparture: daysUntilDeparture}];
        while(times.length < TripService.newTrip.weather.length - 1) {
          departureHours += 1;
          if (departureHours == 24) {
            departureHours = 0;
            daysUntilDeparture += 1;
          }
          if (TripService.newTrip.departure.time.minutes >= 60) {
            TripService.newTrip.departure.time.minutes -= 60;
            departureHours += 1;
          }
          times.push({hours: departureHours, minutes: TripService.newTrip.departure.time.minutes, daysUntilDeparture: daysUntilDeparture});
        }
        times.push({hours: departureHours, minutes: addZero(Math.round(TripService.newTrip.route.duration.leftoverMinutes)), daysUntilDeparture: daysUntilDeparture})
        TripService.newTrip.times = times;
        console.log(TripService.newTrip);
        TripService.trip = TripService.newTrip;
        TripService.calculatingResults = false;
        $location.path("/viewtrip");
      })
    },

    viewTrip: function(trip){
      console.log(trip);
      TripService.calculatingResults = true;
      $http.post('/trips/viewSavedTrip', trip).then(function(response){
        console.log('response', response);
        TripService.savedTrip = response.data;
        console.log('saved trip', TripService.savedTrip);
        TripService.trip = TripService.savedTrip;
        TripService.trip.saved = true;
        TripService.calculatingResults = false;
        $location.path("/viewtrip");
      });
    },

    deleteTrip: function(trip) {
      console.log(trip);
      $http.delete('/trips/' + trip._id).then(function(response){
        console.log(response);
        userService.getuser();
      });
    }
  }

  function addZero(time) {
      if (time < 10) {
          time = "0" + time;
      }
      return time;
  }

  return TripService
});

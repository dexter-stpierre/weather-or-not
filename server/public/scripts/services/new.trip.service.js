myApp.factory('NewTrip', function($http, $location){
  console.log('NewTripService Loaded');
  var newTripService = {
    submitNewTrip: function(newTrip) {
      console.log(newTrip);
      // gets origin and destination coordinates and prepares them to go into object
      var originAddressY = newTrip.originDetails.geometry.viewport.b.b.toPrecision(6);
      var originAddressX = newTrip.originDetails.geometry.viewport.f.f.toPrecision(6);
      var destinationAddressY = newTrip.destinationDetails.geometry.viewport.b.b.toPrecision(6);
      var destinationAddressX = newTrip.destinationDetails.geometry.viewport.f.f.toPrecision(6);
      //prepares object to send to server
      var tripToSend = {
        originAddress: newTrip.originAddress,
        destinationAddress: newTrip.destinationAddress,
        originDetails: newTrip.originDetails,
        destinationDetails: newTrip.destinationDetails,
        origin: [originAddressY, originAddressX],
        destination: [destinationAddressY, destinationAddressX],
        departure: newTrip.departure
      }
      console.log(tripToSend);
      // sets 10 minute timeout for request
      var postConfig = {
        timeout: 600000
      }
      console.log(postConfig);
      //makes post request to server
      $http.post('/trips/newtrip', tripToSend, postConfig).then(function(response){
        console.log(response);
        newTripService.trip = response.data;
        var today = new Date();
        var todayMs = Date.parse(today)
        console.log(todayMs);
        departureDate = Date.parse(newTripService.trip.departure.date);
        console.log(departureDate);
        console.log(departureDate + 864000000);
        if(departureDate > todayMs && departureDate < todayMs + 864000000){
          console.log('in range');
          var daysUntilDeparture = Math.ceil((departureDate - today) / 86400000);
          console.log(daysUntilDeparture);
          newTripService.trip.departure.daysUntilDeparture = daysUntilDeparture;
        }else{
          console.log('out of range');
        }
        var time = new Date(newTripService.trip.departure.time);
        newTripService.trip.departure.time= {};
        newTripService.trip.departure.time.hours = addZero(time.getHours());
        newTripService.trip.departure.time.minutes = addZero(Math.round(time.getMinutes()));
        var departureHours = newTripService.trip.departure.time.hours
        var times = [{hours: departureHours, minutes: newTripService.trip.departure.time.minutes}];
        while(times.length < newTripService.trip.weather.length - 1) {
          departureHours += 1;
          times.push({hours: departureHours, minutes: newTripService.trip.departure.time.minutes});
        }
        times.push({hours: departureHours, minutes: addZero(Math.round(newTripService.trip.route.duration.leftoverMinutes))})
        newTripService.trip.times = times;
        console.log(newTripService.trip);
        $location.path("/viewtrip");
      })
    }
  }

  function addZero(time) {
      if (time < 10) {
          time = "0" + time;
      }
      return time;
  }

  return newTripService
});

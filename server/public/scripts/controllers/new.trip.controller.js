myApp.controller('NewTripController', function(UserService, $http, $scope) {
  console.log('NewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.newTrip = {};
  // prepares newTrip object and sends to server
  vm.submitNewTrip = function(newTrip) {
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
    })
  }

  // options for data binding with google places autocomplete
  vm.options = {
    updateModel: true,
    watchOptions: true
  }
  // function that creates data binding between google places autocomplete and view model
  vm.setOrigin = function(error, details){
    if (error) {
			return console.error(error);
		}
    vm.newTrip.originDetails = details;
    console.log('setOrigin');
    console.log(vm.newTrip.originAddress);
    console.log('originDetails', vm.newTrip.originDetails);
  }
  // function that creates data binding between google places autocomplete and view model
  vm.setDestination = function(error, details){
    if (error) {
			return console.error(error);
		}
    vm.newTrip.destinationDetails = details;
    console.log('setDestination');
    console.log(vm.newTrip.destinationAddress);
    console.log('destinationDetails', vm.newTrip.destinationDetails);
  }
});

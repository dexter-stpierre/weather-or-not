myApp.controller('NewTripController', function(UserService, $http, $scope) {
  console.log('NewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.YOUR_API_KEY = 'AIzaSyANtN7zXwqEGAIwJjpy5vPKDcpsrvtCFm4';
  vm.newTrip = {};
  vm.submitNewTrip = function(newTrip) {
    console.log(newTrip);
    var originAddressY = newTrip.originDetails.geometry.viewport.b.b.toFixed(6);
    var originAddressX = newTrip.originDetails.geometry.viewport.f.f.toFixed(6);
    var destinationAddressY = newTrip.destinationDetails.geometry.viewport.b.b.toFixed(6);
    var destinationAddressX = newTrip.destinationDetails.geometry.viewport.f.f.toFixed(6);
    var tripToSend = {
      originAddress: newTrip.originAddress,
      destinationAddress: newTrip.destinationAddress,
      originDetails: newTrip.originDetails,
      destinationDetails: newTrip.destinationDetails,
      origin: [originAddressY, originAddressX],
      destination: [destinationAddressY, destinationAddressX],
    }
    console.log(tripToSend);
    $http.post('/trips/newtrip', tripToSend).then(function(response){
      console.log(response);
    })
  }

  vm.options = {
    updateModel: true,
    watchOptions: true
  }
  vm.setOrigin = function(error, details){
    if (error) {
			return console.error(error);
		}
    vm.newTrip.originDetails = details;
    console.log('log');
    console.log(vm.newTrip.originAddress);
    console.log('originDetails', vm.newTrip.originDetails);
  }
  vm.setDestination = function(error, details){
    if (error) {
			return console.error(error);
		}
    vm.newTrip.destinationDetails = details;
    console.log('log');
    console.log(vm.newTrip.destinationAddress);
    console.log('destinationDetails', vm.newTrip.destinationDetails);
  }
  vm.logNewTrip = function(){
    console.log(vm.newTrip);
  }
});

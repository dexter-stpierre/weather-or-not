myApp.controller('NewTripController', function(UserService, $http, $scope, Trip, $location) {
  console.log('NewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.newTrip = {};
  vm.newTripService = Trip;

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

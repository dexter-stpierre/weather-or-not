myApp.controller('ViewTripController', function(UserService, $http, Trip, $location) {
  console.log('ViewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.TripService = Trip;
  vm.trip = Trip.trip
  console.log(vm.trip);
  console.log(vm.savedTrip);
});

myApp.controller('ViewTripController', function(UserService, $http, NewTrip, $location) {
  console.log('ViewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.newTripService = NewTrip;
  vm.trip = NewTrip.trip
  console.log(vm.trip);
});

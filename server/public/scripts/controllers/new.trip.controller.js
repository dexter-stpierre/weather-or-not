myApp.controller('NewTripController', function(UserService, $http) {
  console.log('NewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.newTrip = {};
  vm.submitNewTrip = function(newTrip) {
    console.log(newTrip);
    $http.post('/trips/newtrip', newTrip).then(function(response){
      console.log(response);
    })
  }
});

myApp.controller('NewTripController', function(UserService, $http) {
  console.log('NewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.newTrip = {
    origin: {x: -93.266563, y: 44.96313},
    destination: {x: -98.380429, y: 38.500327}
  };
  vm.submitNewTrip = function(newTrip) {
    console.log(newTrip);
    $http.post('/trips/newtrip', newTrip).then(function(response){
      console.log(response);
    })
  }
});

myApp.controller('NewTripController', function(UserService, $http) {
  console.log('NewTripController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.YOUR_API_KEY = 'AIzaSyANtN7zXwqEGAIwJjpy5vPKDcpsrvtCFm4';
  vm.newTrip = {
    origin: [-93.266563, 44.96313],
    destination: [-98.380429, 38.500327]
  };
  vm.submitNewTrip = function(newTrip) {
    console.log(newTrip);
    $http.post('/trips/newtrip', newTrip).then(function(response){
      console.log(response);
    })
  }
});

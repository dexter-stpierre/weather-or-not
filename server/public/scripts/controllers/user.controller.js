myApp.controller('UserController', function(UserService, Trip) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.tripService = Trip;
  console.log(vm.userObject);
});

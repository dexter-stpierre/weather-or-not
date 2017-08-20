myApp.controller('NavController', function($scope, $timeout, $mdSidenav, UserService) {
  console.log('NavService loaded');
  var vm = this;
  $scope.userObject = UserService.userObject;
  $scope.UserService = UserService;
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      UserService.checkuser();
      $scope.userObject = UserService.userObject;
      $mdSidenav(componentId).toggle();
    };
  }
});

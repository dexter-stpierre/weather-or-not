var myApp = angular.module('myApp', ['ngRoute', 'ngPlacesAutocomplete', 'ngMaterial', 'md.data.table']);
  // myApp.config(function ($mdThemingProvider,pickerProvider) {
  //       pickerProvider.setOkLabel('Save');
  //       pickerProvider.setCancelLabel('Close');
  //       //  Over ride day names by changing here
  //       pickerProvider.setDayHeader('single');  //Options 'single','shortName', 'fullName'
  //   }
  /// Routes ///
  myApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    console.log('myApp -- config')
    $routeProvider
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'NewTripController as ntc',
    })
    .when('/viewtrip', {
      templateUrl: '/views/templates/view.trip.html',
      controller: 'ViewTripController as vtc',
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/myTrips', {
      templateUrl: '/views/templates/mytrips.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });
  });

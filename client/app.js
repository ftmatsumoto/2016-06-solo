var app = angular.module('app', ['app.option', 'ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/stockoption', {
      controller:'OptionController',
      templateUrl:'stockoption.html'
    }).
    otherwise({
      redirectTo: '/'
    });
});

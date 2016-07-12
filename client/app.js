var app = angular.module('app', ['app.option', 'app.portfolio', 'ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/stockoption', {
      controller:'OptionController',
      templateUrl:'pricing/stockoption.html'
    })
    .when('/portfolio', {
      controller:'PortfolioController',
      templateUrl:'portfolio/portfolio.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.factory('portfolioFactory', function(){
  return {
    storage: []
  };
});
angular.module('app.option', [])
.controller('OptionController', function ($scope) {
  $scope.output = 0;
  // $scope.date = Date.now();
  $scope.BlackScholes = function (putcall, spot, strike, time, rfrate, volatility) {
    var d1, d2;
    var time = Math.round(time - Date.now())/(24 * 60 * 60 * 1000 * 365);

    d1 = (Math.log(spot/strike) + (rfrate + volatility * volatility / 2.0) * time) / (volatility * Math.sqrt(time));
    d2 = d1 - volatility * Math.sqrt(time);

    if (putcall === "c") {
      $scope.output = spot * $scope.CND(d1) - strike * Math.exp(-rfrate * time) * $scope.CND(d2);
    } else {
      $scope.output = strike * Math.exp(-rfrate * time) * $scope.CND(-d2) - spot * $scope.CND(-d1);
    }
  }

  /* The cummulative Normal distribution function: */
  $scope.CND = function (x){
      var a1, a2, a3, a4, a5, k;

      a1 = 0.31938153, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978 , a5 = 1.330274429;
      if (x < 0.0) {
        return 1 - $scope.CND(-x);
      } else {
        k = 1.0 / (1.0 + 0.2316419 * x);
        return 1.0 - Math.exp(-x * x / 2.0)/ Math.sqrt(2 * Math.PI) * k * (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) ;
      }
  }
})

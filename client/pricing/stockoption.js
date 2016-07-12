angular.module('app.option', [])
.controller('OptionController', function ($scope, portfolioFactory) {
  // $scope.output = 0;
  $scope.storage = [];

  $scope.addOption = function(ticker, cpflag, spot, k, expdate, intrate, vol) {
    $scope.storage.push({
      contracts: 0,
      ticker: ticker,
      cpflag: cpflag || 'c',
      spot: spot || 0,
      k: k || 0,
      expdate: $scope.fixTime(expdate),
      intrate: intrate || 0,
      vol: vol || 0,
      bsprice: $scope.BlackScholes(cpflag, spot, k, expdate, intrate, vol)
    })
    // console.log($scope.storage);
  };
  $scope.addContract = function(item) {
    var index = $scope.storage.indexOf(item);
    $scope.storage[index].contracts++;
  };
  $scope.reduceContract = function(item) {
    var index = $scope.storage.indexOf(item);
    $scope.storage[index].contracts--;
  };
  $scope.deleteContract = function(item) {
    var index = $scope.storage.indexOf(item);
    $scope.storage.splice(index, 1);
  };
  $scope.fixTime = function(time){
    return (!time) ? 0 : Math.round(time - Date.now())/(24 * 60 * 60 * 1000 * 365);
  };
  $scope.totalSpend = function(){
    // console.log(0000000)
    return $scope.storage.reduce(function(res, item){
      return res += item.contracts * item.bsprice;
    }, 0)
  };
  $scope.BlackScholes = function (putcall, spot, strike, time, rfrate, volatility) {
    var d1, d2;
    if (!(putcall || spot || strike || time || rfrate || volatility)) {
      return "error";
    }
    time = $scope.fixTime(time);
    rfrate = rfrate / 100;
    volatility = volatility / 100;

    // console.log(putcall, spot, strike, time, rfrate, volatility);

    d1 = (Math.log(spot/strike) + (rfrate + volatility * volatility / 2.0) * time) / (volatility * Math.sqrt(time));
    d2 = d1 - volatility * Math.sqrt(time);

    // delta = $scope.CND(d1) * Math.exp(-rfrate * time);

    if (putcall === "c") {
      // console.log(spot * $scope.CND(d1) - strike * Math.exp(-rfrate * time) * $scope.CND(d2));
      return spot * $scope.CND(d1) - strike * Math.exp(-rfrate * time) * $scope.CND(d2);
    } else {
      // console.log(strike * Math.exp(-rfrate * time) * $scope.CND(-d2) - spot * $scope.CND(-d1));
      return strike * Math.exp(-rfrate * time) * $scope.CND(-d2) - spot * $scope.CND(-d1);
    }
  };

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
  };
})

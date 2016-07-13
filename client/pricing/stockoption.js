angular.module('app.option', ['app.chart'])
.controller('OptionController', function ($scope, portfolioFactory) {
  // $scope.spot = 0;

  $scope.myData = [];

  $scope.storage = [];

  $scope.addPayout = function(){
    var result = [];
    for (var i = 0; i < $scope.storage.length; i++) {
      if ($scope.storage[i]['cpflag'] === 'c') {
        for (var j = -20; j <= 20; j++) {
          console.log($scope.storage[i]['spot'], j, $scope.storage[i]['k']);
          var obj = {};
          obj['price'] = $scope.storage[i]['spot'] + j;
          obj['payout'] = Math.max((obj['price'] - $scope.storage[i]['k']),0) - $scope.storage[i]['bsprice'];
          result.push(obj);
        }
      } else {
        for (var j = -20; j <= 20; j++) {
          var obj = {};
          obj['price'] = ($scope.storage[i]['spot'] + j)
          obj['payout'] = Math.max(($scope.storage[i]['k'] - obj['price']),0) - $scope.storage[i]['bsprice'];
          result.push(obj);
        }
      }
    }
    // console.log($scope.myData);
    $scope.myData = result.slice();
    // console.log($scope.myData);
  };

  $scope.addOption = function(ticker, cpflag, spot, k, expdate, intrate, vol) {
    // console.log(ticker, cpflag, spot, k, expdate, intrate, vol);
    $scope.storage.push({
      contracts: 0,
      ticker: ticker,
      cpflag: cpflag || 'c',
      spot: spot || 0,
      k: k || 0,
      expdate: expdate,
      intrate: intrate || 0,
      vol: vol || 0,
      bsprice: $scope.BlackScholes(cpflag, spot, k, expdate, intrate, vol)
    })
    $scope.addPayout();
  };

  $scope.updatePrice = function(newSpot){
    // console.log('update')
    for (var i = 0; i < $scope.storage.length; i++) {
      cpflag = $scope.storage[i]['cpflag'];
      spot = newSpot;
      k = $scope.storage[i]['k'];
      expdate = $scope.storage[i]['expdate'];
      intrate = $scope.storage[i]['intrate'];
      vol = $scope.storage[i]['vol'];
      // console.log($scope.BlackScholes(cpflag, spot, k, expdate, intrate, vol), cpflag, spot, k, expdate, intrate, vol);
      $scope.storage[i]['bsprice'] = $scope.BlackScholes(cpflag, spot, k, expdate, intrate, vol);
    }
    $scope.addPayout();
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

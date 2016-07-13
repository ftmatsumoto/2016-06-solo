angular.module( 'app.chart', [])

.directive( 'lineChart', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function (scope, element, attr) {
        console.log('LINK CALL');
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 800 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        // var formatDate = d3.time.format("%d-%b-%y");
        var svg = d3.select(element[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x)

        var yAxis = d3.axisLeft(y)

        var line = d3.line()
            .x(function(d) { return x(d.price); })
            .y(function(d) { return y(d.payout); });

        //Render graph based on 'data'
        scope.render = function(data) {
          console.log(data);
          //Set our scale's domains
          x.domain(d3.extent(data, function(d) { return d.price; }));
          y.domain(d3.extent(data, function(d) { return d.payout; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          // d3.select("body").append("svg")
          //     .attr("class", "axis")
          //     .attr("width", 1440)
          //     .attr("height", 30)
          //   .append("g")
          //     .attr("transform", "translate(0,30)")
          //     .call(axis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Price ($)");

          // for (var i = 0; i < data.length; i++) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
          // }

        };

         //Watch 'data' and run scope.render(newVal) whenever it changes
         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
          scope.$watch('data', function(){
              console.log('CHART.JS CALL');
              scope.render(scope.data);
          }, true);
        }
    };
  }
]);
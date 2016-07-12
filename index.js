var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/client'));
//Store all HTML files in view folder.
//Store all JS and CSS in Scripts folder.

app.get('/', function (req, res) {
  // console.log(req);
  res.sendFile('index.html');
});

app.get('/api/stockoption', function (req, res) {
  // console.log('22222222222');
  res.sendFile('index.html');
});

app.listen(port);

console.log('Server now listening on port ' + port);
var express = require('express');
var app = express();

var spreadsheet = require('./lib/spreadsheet');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/_get_spreadsheet', function(req, res) {
    spreadsheet.getSpreadsheet(function(data) {
        res.send(data);
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('smallgroup mapper app listening at http://%s:%s', host, port);
});

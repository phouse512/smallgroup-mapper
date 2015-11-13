var express = require('express');
var app = express();
var path = require('path');

var spreadsheet = require('./lib/spreadsheet');
var map = require('./lib/map');

app.use(express.static('public'));

app.get('/', function (req, res) {
//  res.send('Hello World!');
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/_get_spreadsheet', function(req, res) {
    spreadsheet.getSpreadsheet(function(data) {
        console.log(typeof(data));

        map.geocodeAddresses(data, function(userLocations) {
          console.log('made it!');
          console.log(userLocations);
          res.send(userLocations);
        });
    });
});

app.get('/_test_geolocation', function(req, res) {
    map.geocodeAddresses('phil', '1700 Hinman Ave, Evanston IL', false, function(workDict, homeDict) {
        console.log(homeDict);
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('smallgroup mapper app listening at http://%s:%s', host, port);
});

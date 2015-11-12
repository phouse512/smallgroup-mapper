var $ = require('jquery');
var request = require('request')

var HOST = '127.0.0.1:3000/';

function appStart(){
    // start loading state
    
    getSpreadsheet(function(data) {
        
    });
    // request spreadsheet data as an array of dictionaries
    // for each datapoint, call geocoding api to get the latitude
    //
    // build map
    //  apply markers
    //  listen to toggle
    //  

}

function getSpreadsheet(callback) {
    request(HOST + '_get_spreadsheet/', function(error, response, body) {
        if (!error && response.statusCode == 200){
            callback(body);
        }
    }
}

$.(document).ready(function() {
    appStart();
});


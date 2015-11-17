var $ = require('jquery');
var request = require('request');
var map = require('./map');
var googleMap;

var HOST = 'http://127.0.0.1:3000/';

function appStart(){
    // start loading state
    getUsers(function(data) {
       console.log(data);

       jsonData = JSON.parse(data)

        var marker = new google.maps.Marker({
            position: jsonData[0].workLoc,
            map: googleMap,
            title: 'Hello World!',
            label: jsonData[0].name
        });
    });

    
    // request spreadsheet data as an array of dictionaries
    // for each datapoint, call geocoding api to get the latitude
    //
    // build map
    //  apply markers
    //  listen to toggle
    //  
    
}

function buildMap(mapData) {
      
}

function getUsers(callback) {
    request(HOST + '_get_spreadsheet/', function(error, response, body) {
        if (!error && response.statusCode < 300){
            callback(body);
        } else {
            alert('network called, refresh and try againz');
        }
    });
}

function initMap() {
    console.log('yo the map has loaded');
    googleMap = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.98, lng: -87.6847},
        zoom: 11
    });
}



$(document).ready(function() {
    appStart();
    console.log('ready');
});

module.exports = {
    initMap: initMap
}
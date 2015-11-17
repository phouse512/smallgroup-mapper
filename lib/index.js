var $ = require('jquery');
var request = require('request');
var map = require('./map');
var googleMap;
var allMarkers = {};
var infoWindows = {};

var HOST = 'http://127.0.0.1:3000/';

function appStart(){
    // start loading state
    getUsers(function(data) {
       console.log(data);

        jsonData = JSON.parse(data)
        buildMap(jsonData);
    });

    
    // request spreadsheet data as an array of dictionaries
    // for each datapoint, call geocoding api to get the latitude
    //
    // build map
    //  apply markers
    //  listen to toggle
    //  
    
}

/*
 * Takes in an array of user objects returned from the /get_spreadsheets/ endpoint, and builds the 
 *   markers for them as well as the info windows 
 */
function buildMap(mapData) {
    for(var i=0; i < mapData.length; i++) {
        var tempWorkMarker = new google.maps.Marker({
            // build marker for work
            buildMarkerAndInfo(mapData[i].name, mapData[i].workLoc.lat, mapData[i].workLoc.long, 'work');
        
            // build marker for home
            buildMarkerAndInfo(mapData[i].name, mapData[i].homeLoc.lat, mapData[i].homeLock.long, 'work');

        });
    }
}

/*
 *  Takes in a string of the name, the lat, long, and string of type and builds the marker
 */
function buildMarkerAndInfo(name, lat, long, type) {
    var userKey = generateUserKey(name, type);

    allMarkers[userKey] = new google.maps.Marker({
        position: {
            lat: lat,
            long: long
        },
        animation: google.maps.Animation.DROP,
        map: googleMap,
        title: userKey,
        label: userKey
    });

    var contentString = "<p>" + name + "'s " + type + " address.</p>";
    infoWindows[userKey] = new google.maps.InfoWindow({
        content: contentString
    });

    allMarkers[userKey].addListener('mouseover', function() {
        infoWindows[userKey].open(googleMap, allMarkers[userKey]);
    });

}    

// generates a user key based on the name and address type to be used in identifying the marker
//   in the marker and info window hashes.   
function generateUserKey(name, type) {
    return name + '-' + type;
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
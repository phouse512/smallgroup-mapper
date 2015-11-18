var $ = require('jquery');
var request = require('request');
var map = require('./map');
var handlebars = require('handlebars');
var googleMap;
var allMarkers = {};
var infoWindows = {};

var HOST = 'http://127.0.0.1:3000/';

function appStart(){
    // start loading state
    getUsers(function(data) {
        $("#loading").hide();
        jsonData = JSON.parse(data);
        console.log(jsonData);
        buildMap(jsonData, buildUserList);
    });
}

/*
 * display all the user objects next to the map
 */
function buildUserList(userData) {
    var source = $("#name-template").html();
    var template = handlebars.compile(source);
    var elements = []

    for(var i=0; i < userData.length; i++) {
        var context = {
            name: userData[i].name,
            workAddress: userData[i].workAddress || "n/a",
            homeAddress: userData[i].homeAddress || "n/a",
        };

        elements[i] = $(template(context));
        elements[i].hide().appendTo("#userList").fadeIn(1000);
    }

    $(".userObject").mouseenter(function(){
        console.log($(this).data("user"));
        userKeyWork = generateUserKey($(this).data("user"), 'work');
        userKeyHome = generateUserKey($(this).data("user"), 'home');
        console.log(userKeyHome);
        console.log(userKeyWork);
        try {
            infoWindows[userKeyWork].open(googleMap, allMarkers[userKeyWork]);
        } catch(err) {
            console.log('nonexistent work');
        }
        try {
            infoWindows[userKeyHome].open(googleMap, allMarkers[userKeyHome]);
        } catch(err) {
            console.log('nonexistent home address');
        }
    }).mouseleave(function(){
        userKeyWork = generateUserKey($(this).data("user"), 'work');
        userKeyHome = generateUserKey($(this).data("user"), 'home');
        try {
            infoWindows[userKeyWork].close();
        } catch(err) {
            console.log('nonexistent work');
        }
        try {
            infoWindows[userKeyHome].close();
        } catch(err) {
            console.log('nonexistent home address');
        }
    });

}

/*
 * Takes in an array of user objects returned from the /get_spreadsheets/ endpoint, and builds the 
 *   markers for them as well as the info windows 
 */
function buildMap(mapData, callback) {
    for(var i=0; i < mapData.length; i++) {
        console.log(mapData[i]);
        // build marker for work
        try {
            buildMarkerAndInfo(mapData[i].name, mapData[i].workLoc.lat, mapData[i].workLoc.lng, 'work');
        } catch(err) {
            console.log('no work address');
        }
        // build marker for home
        try {
            buildMarkerAndInfo(mapData[i].name, mapData[i].homeLoc.lat, mapData[i].homeLoc.lng, 'home');
        } catch(err) {
            console.log('no home address');
        }
    }
    callback(mapData);
}

/*
 *  Takes in a string of the name, the lat, long, and string of type and builds the marker
 */
function buildMarkerAndInfo(name, lat, lng, type) {
    var userKey = generateUserKey(name, type);

    allMarkers[userKey] = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
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

    allMarkers[userKey].addListener('mouseout', function() {
        infoWindows[userKey].close();
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
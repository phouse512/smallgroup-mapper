var request = require('request');
var _ = require('underscore');

var GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

var userTaskHash = {};
var userLocations = {};
var done = false;

module.exports = {
    geocodeAddresses: function(uniqueId, addressList, callbackHell) {
        userTaskHash[uniqueId] = [];
        userLocations[uniqueId] = {};
        for (var i=0; i < addressList.length; i++) {
            // do the stupid stuff here for both work and home
            userTaskHash[uniqueId].push({ name: addressList[i].name, address: addressList[i].workAddress, workBool: true});
            userTaskHash[uniqueId].push({ name: addressList[i].name, address: addressList[i].homeAddress, workBool: false});
            userLocations[uniqueId][addressList[i].name] = {};
        }
        // console.log(userTaskHash[uniqueId]);
        geocodeAddressThrottle(uniqueId, callbackHell);
    }
}

function geocodeAddressThrottle(uniqueId, callbackHell) {
    console.log('inside throttle method ' + userTaskHash[uniqueId].length);
    if (userTaskHash[uniqueId].length < 1) {
        console.log('bad space');
        done = true;
        var users = [];

        // transform dict of names to array of dictionaries
        for (var property in userLocations[uniqueId]) {
            if (userLocations[uniqueId].hasOwnProperty(property)) {
                tempDict = userLocations[uniqueId][property];
                tempDict['name'] = property;
                users.push(tempDict);
            }
        }
        callbackHell(users);
        return;
    }
    currTask = userTaskHash[uniqueId][0];
    // finish query params, etc
    if (userTaskHash[uniqueId].length > 0 && (currTask.address == null || currTask.address == "null" || currTask.address.length < 1)) {
        console.log('null values');
        if (currTask.workBool) {
            userLocations[uniqueId][currTask.name]['workLoc'] = null;    
        } else {
            userLocations[uniqueId][currTask.name]['homeLoc'] = null;
        }
        userTaskHash[uniqueId].shift();
        console.log('tasks left: ' + userTaskHash[uniqueId].length);

    } else if (userTaskHash[uniqueId].length > 0) {
        queryString = { address: currTask.address };
        request({ url: GEOCODE_URL, qs: queryString }, function(error, response, body) {
            console.log('got a response');
            responseBody = JSON.parse(body);
            if(error || response.statusCode >= 300 || body.status != "OK") {
                // request deddddd
                console.log(body.status);
            }

            console.log(currTask.workBool);
            console.log(currTask.name + "'s location: " + responseBody.results[0].geometry.location.lat + " " + responseBody.results[0].geometry.location.lng);

            if (currTask.workBool == true) {
                userLocations[uniqueId][currTask.name]['workLoc'] = responseBody.results[0].geometry.location;    
                userLocations[uniqueId][currTask.name]['workAddress'] = currTask.address;
            } else {
                userLocations[uniqueId][currTask.name]['homeLoc'] = responseBody.results[0].geometry.location;
                userLocations[uniqueId][currTask.name]['homeAddress'] = currTask.address;
            }
            userTaskHash[uniqueId].shift();

            console.log('tasks left: ' + userTaskHash[uniqueId].length);
        });
    }

    if (userTaskHash[uniqueId].length >= 0) {

        setTimeout(function(){
            geocodeAddressThrottle(uniqueId, callbackHell);
        }, 200);
    }
}



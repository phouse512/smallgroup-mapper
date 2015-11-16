var request = require('request');
var _ = require('underscore');

var GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

var tasks = [];
var userLocations = {}
var done = false;

module.exports = {
    geocodeAddresses: function(addressList, callbackHell) {
        for (var i=0; i < addressList.length; i++) {
            // do the stupid stuff here for both work and home
            // because lodash sucks
            // jk NODE SUCKS CALLBACK BALZ
            tasks.push({ name: addressList[i].name, address: addressList[i].workAddress, workBool: true});
            tasks.push({ name: addressList[i].name, address: addressList[i].homeAddress, workBool: false});
            userLocations[addressList[i].name] = {};
        }
        console.log(tasks);
        geocodeAddressThrottle(callbackHell);
    }
}

function geocodeAddressThrottle(callbackHell) {
    console.log('inside throttle method ' + tasks.length);
    if (tasks.length < 1) {
        console.log('bad space');
        // for(var i=0; i < timers.length; i++){
        //     clearTimeout(timers[i]);
        // }
        done = true;
        var users = [];

        // transform dict of names to array of dictionaries
        for (var property in userLocations) {
            if (userLocations.hasOwnProperty(property)) {
                tempDict = userLocations[property];
                tempDict['name'] = property;
                users.push(tempDict);
            }
        }
        callbackHell(users);
        return;
    }
    currTask = tasks[0];
    // finish query params, etc
    if (tasks.length > 0 && (currTask.address == null || currTask.address == "null" || currTask.address.length < 1)) {
        console.log('null values');
        if (currTask.workBool) {
            userLocations[currTask.name]['workLoc'] = null;    
        } else {
            userLocations[currTask.name]['homeLoc'] = null;
        }
        tasks.shift();
        console.log('tasks left: ' + tasks.length);

    } else if (tasks.length > 0) {
        queryString = { address: currTask.address };
        request({ url: GEOCODE_URL, qs: queryString }, function(error, response, body) {
            console.log('got a response');
            responseBody = JSON.parse(body);
            if(error || response.statusCode >= 300 || body.status != "OK") {
                // request deddddd
                console.log(body.status);
            }

            if (currTask.workBool) {
                userLocations[currTask.name]['workLoc'] = responseBody.results[0].geometry.location;    
            } else {
                userLocations[currTask.name]['homeLoc'] = responseBody.results[0].geometry.location;
            }
            tasks.shift();

            console.log('tasks left: ' + tasks.length);
        });
    }

    if (tasks.length >= 0) {

        setTimeout(function(){
            geocodeAddressThrottle(callbackHell);
        }, 200);
    }
}



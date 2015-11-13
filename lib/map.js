var GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
var requestCount = 0;
var totalCount = 0;
var workDict = {};
var homeDict = {};

module.exports = {
    geocodeAddresses: function(addressList, callbackHell) {
        totalCount = addressList.length * 2;
        _(addressList).forEach(function(userObject) {
           _.throttle(function(userObject) {
                // do the stupid stuff here for both work and home
                // because lodash sucks
           }, 300);
        }).value();
    },
    geocodeAddress: function(name, userAddress, workBool, callbackHell) {
        // finish query params, etc
        if (userAddress == null || userAddress == "null" || userAddress.length < 1) {
            requestCount++;
            if (workBool) {
                workDict[name] = ''; 
            } else {
                homeDict[name] = '';
            }

            if (requestCount == totalCount) {
                callbackHell(workDict, homeDict);
            }
            return;
        }
        queryString = { address: userAddress };
        request({ url: GEOCODE_URL, qs: queryString }, function(error, response, body) {
            requestCount++;
            if(error || response.statusCode >= 300) {
                // request deddddd
            }

            if (workBool) {
                workDict[name] = body.results[0].geometry.location;    
            } else {
                homeDict[name] = body.results[0].geometry.location;
            }

            if (requestCount == totalCount) {
                callbackHell(workDict, homeDict);
            }

        });
    },
    doneGeocoding: function(filledAddressBlob) {
        return filledAddressBlob;
    }
}


/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card({
  title: '',
  subtitle: '',
  body: ''
});

var clockThread = function(){
  var pad2 = function (n) { return n < 10 ? '0' + n : n };
  var date = new Date();
  main.title(date.getFullYear().toString() + '/' +
             pad2(date.getMonth() + 1)     + '/' +
             pad2(date.getDate()));
  main.subtitle(pad2(date.getHours())   + ':' +
                pad2(date.getMinutes()) + ':' +
                pad2(date.getSeconds())); 
};

var id;
function locationSuccess(pos) {
  console.log('Location changed!');
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  ajax(
  {
    url: 'http://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=1&lat='+pos.coords.latitude+'&lon='+pos.coords.longitude,
    type: 'json'
  },
  function(data, status, request) {
    var address = new Array();
    if(undefined != data.address.road){address.push(data.address.road);}
    if(undefined != data.address.suburb){address.push(data.address.suburb);}
    if(undefined != data.address.hamlet){address.push(data.address.hamlet);}
    if(undefined != data.address.city){address.push(data.address.city);}
    if(undefined != data.address.state_district){address.push(data.address.state_district);}
    if(undefined != data.address.state){address.push(data.address.state);}
    if(undefined != data.address.postcode){address.push(data.address.postcode);}
    if(undefined != data.address.country_code){address.push(data.address.country_code);}
    main.body(address.join());
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
  );
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

console.log('Pebble.addEventListener start');
//Pebble.addEventListener('ready',
//  function(e) {
    console.log('Ready');
    var locationOptions = {
      enableHighAccuracy: true, 
      maximumAge: 0, 
      timeout: 5000
    };
    // Get location updates
    id = navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
//  }
//);
console.log('Pebble.addEventListener end');
console.log('main.show() start');
setInterval(clockThread,1000);
main.show();
console.log('main.show() end');
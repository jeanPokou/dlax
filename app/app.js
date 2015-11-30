// -----------------------------------------------------
// Here is the starting point for your own code.
// All stuff below is just to show you how it works.
// -----------------------------------------------------

// Browser modules are imported through new ES6 syntax.
// import { greet } from './hello_world/hello_world';
//
// // Node modules are required the same way as always.
// var os = require('os');
//
// // window.env contains data from config/env_XXX.json file.
// var envName = window.env.name;
var drivers = [];
var DriversApi = require('./api/Drivers');
var fs =  require('fs');
var api = new DriversApi();
api.on('drivers',function(data) {

  var path = __dirname + '/drivers.json';
  fs.writeFile(path, data,'utf8',function() {
    drivers = JSON.parse(data);
    document.querySelector('#driversList').driversData  = drivers;
  });
});

window.addEventListener('WebComponentsReady', function() {

});

// document.getElementById('platform-info').innerHTML = os.platform();
// document.getElementById('env-name').innerHTML = envName;

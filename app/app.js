// var DriversApi = require('./api/Drivers');
//
// // var ipc = require('ipc');
//
// // var settingsWindow;
// //loading the drives list
// window.addEventListener('WebComponentsReady', function() {
//
//   DriversApi.loadDrivers(DriversApi.dbPath);
//   // var app = document.querySelector('#neonApp');
//
// });

  'use strict';
var DriversApi = require('./api/Drivers');
window.addEventListener('WebComponentsReady', function() {

  DriversApi.loadDrivers(DriversApi.dbPath);

});

// var app = document.querySelector('#app');
//    app.selected = 0;
//    app.next = function() {
//        app.selected = 0;
//
//    };

// // document.getElementById('env-name').innerHTML = envName;
// // -----------------------------------------------------
// // Here is the starting point for your own code.
// // All stuff below is just to show you how it works.
// // -----------------------------------------------------
//
// //Browser modules are imported through new ES6 syntax.
import { greet } from './hello_world/hello_world';
// // document.getElementById('greet').innerHTML = greet();
// // // Node modules are required the same way as always.
// // var os = require('os');
// //
// // // window.env contains data from config/env_XXX.json file.
// // var envName = window.env.name;
// //    var path = __dirname + '/drivers.json';
//     // fs.writeFile(path, data,'utf-8',function() {
//     //   // drivers = JSON.parse(data);
//     //   //document.querySelector('#driversList').driversData  = drivers;
//     // });

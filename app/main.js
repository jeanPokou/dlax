'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
var DriversApi = require('./api/Drivers');
var fs =  require('fs');
// var events = require('events');
// var eventEmitter = new events.eventEmitter();

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600
});

var api = new DriversApi();
api.on('drivers',function(data) {

  var path = __dirname + '/drivers.json';
  console.log('path' + path);
  fs.writeFile(path, data,'utf8',function() {
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    console.log('done loading');
  });
});
// You have data from config/env_XXX.json file loaded here in case you need it.
// console.log(env.name);

app.on('ready', function() {

  //  getDriverID();
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }

  mainWindow.on('close', function() {
    mainWindowState.saveState(mainWindow);
  });
});

app.on('window-all-closed', function() {
  app.quit();
});

'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
var Parser = require('node-dbf');
var jetpack = require('fs-jetpack');
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var mimelib = require('mimelib');
// var events = require('events');
// var eventEmitter = new events.eventEmitter();


var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600
});

// You have data from config/env_XXX.json file loaded here in case you need it.
// console.log(env.name);

var parser = new Parser('T:\\TDSM_Wagropur\\dbf\\driver.dbf');
parser.on('start',function(p) {
  console.log('dbf file is parsed');
});
parser.on('end',function() {
  console.log('parsing done !');
  jetpack.append('driver.json',JSON.stringify(drivers));
});

var drivers = [];
parser.on('record',function(record) {
  drivers.push(record);

  // for (var key in record) {
  //   jetpack.append('driver.json',JSON.stringify(record[key]));
  // }
});

function getDriverID() {

  var test = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
  ['t:/TDSM_Wagropur/dbf/driver.dbf']);
  test.stdout.on('data',function(data) {

    console.log(' new data');
    console.log(data.toString('utf-8'));
    // console.log('new data'+ data.toString('utf-8'));
    var path = __dirname + '/drivers.json';
    fs.writeFile(path, data,'utf8',function() {
      console.log('done');
      mainWindow.loadURL('file://' + __dirname + '/index.html');
    });
    // jetpack.write(__dirname+ '/drivers.json',data.toString('utf-8'));

  });
}

app.on('ready', function() {

  getDriverID();
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }
  // mainWindow.loadURL('file://' + __dirname + '/index.html');
  //parser.parse();

  mainWindow.on('close', function() {
    mainWindowState.saveState(mainWindow);
  });
});

app.on('window-all-closed', function() {
  app.quit();
});

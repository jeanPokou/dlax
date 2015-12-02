'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
var ipc = require('ipc');
var mainWindow;
var settingsWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600
});

function createSettings() {
  settingsWindow = new BrowserWindow({
        width: 640,
        height: 280,
        show: false
      });
  settingsWindow.loadUrl('file://' + __dirname +
      '/modules/settings/settings.html');

  // ipc.on('show-settings',function() {
  //   settingsWindow.show();
  //   console.log('hello');
  // });
  settingsWindow.openDevTools();
  //settingsWindow.show();

}

app.on('ready', function() {

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  if (mainWindowState.isMaximized) {
    mainWindow.maximize();
  }
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('close', function() {
    mainWindowState.saveState(mainWindow);
  });
  createSettings();

  mainWindow.openDevTools();
});

app.on('window-all-closed', function() {
  app.quit();
});

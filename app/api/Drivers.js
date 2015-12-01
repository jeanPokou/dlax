var spawn = require('child_process').spawn;
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var trailingNewline = require('trailing-newline');
var dbPath = 'T:/TDSM_Wdistech/dbf';
var apiExe = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
[]);

var DriversApi = function() {

  var self = this;
  var driversJson = '';
  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {
    driversJson += data.toString('utf-8');
    if (trailingNewline(data.toString('utf-8'))) {
      self.emit('drivers',driversJson);
    }

  });

  self.loadDrivers = function() {
    apiExe.stdin.write(dbPath + '/driver.dbf\n');
  };

  self.edit = function() {
    //  test.stdin.setEncoding('utf-8');
    //  test.stdin.write('c:/tdsm_w/dbf/drivers.dbf');
  };

  self.on('edit',self.edit);

  //loading the drives list
  self.loadDrivers();
};
util.inherits(DriversApi,EventEmitter);
module.exports = DriversApi ;

var spawn = require('child_process').spawn;
var util = require('util');
var EventEmitter = require('events').EventEmitter;
//var dbPath = 'c:/TDSM_W/dbf/';
var dbPath = 't:/TDSM_Wagropur/dbf/';
var apiExe = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
[]);

var DriversApi = function() {

  var self = this;
  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {
    //console.log(data.toString('utf-8'));
    self.emit('drivers',data.toString('utf-8'));
  });

  self.loadDrivers = function() {
    apiExe.stdin.write(dbPath + 'driver.dbf\n');
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

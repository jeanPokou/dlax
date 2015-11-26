
var spawn = require('child_process').spawn;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var DriversApi = function() {

  var self = this;

  self.getDrivers = function() {

    var test = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
    ['t:/TDSM_Wagropur/dbf/driver.dbf']);
    test.stdout.on('data',function(data) {
      self.emit('drivers',data.toString('utf-8'));
    });
  };
  self.getDrivers();
};
util.inherits(DriversApi,EventEmitter);
module.exports = DriversApi ;

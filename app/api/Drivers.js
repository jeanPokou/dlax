 var spawn = require('child_process').spawn;
var util = require('util');
var events = require('async-node-events');
var trailingNewline = require('trailing-newline');
var dbPath = 'C:/TDSM_W/dbf';
// var dbPath = 'T:/TDSM_Wdistech/dbf';
var apiExe = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
[]);

function  DriversApi() {
  events.call(this);
  this.driversList = [] ;

}
util.inherits(DriversApi,events);

DriversApi.prototype.loadDrivers = function() {
  apiExe.stdin.write(dbPath + '/driver.dbf\n');
  var self = this;
  var driversJson = '';
  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {
        driversJson += data.toString('utf-8');
        if (trailingNewline(data.toString('utf-8'))) {
          //  console.log(driversJson);

          self.emit('driversLoaded',driversJson);

        }

      });

  self.on('driversLoaded',function(data) {
            console.log('in drivers');
            self.driversList = JSON.parse(data.toString('utf-8'));
            //    console.log(self.driversList);
            var dl = document.querySelector('drivers-list');
            dl.driversData = self.driversList;

          });

};

module.exports = new  DriversApi() ;

 var spawn = require('child_process').spawn;
var util = require('util');
var events = require('async-node-events');
var trailingNewline = require('trailing-newline');
//var dbPath = 'C:/TDSM_W/dbf';
// var dbPath = 'T:/TDSM_Wdistech/dbf';
var apiExe = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
[]);

function  DriversApi() {
  events.call(this);
  this.driversList = [] ;

}
util.inherits(DriversApi,events);

DriversApi.prototype.loadDrivers = function(path) {
  // return if path is empty
  if (path === '') {
    return ;
  }
  if (util.isNullOrUndefined(path)) {
    path = dbPath + '/driver.dbf\n';
  } else {
    path = path + '/driver.dbf\n';
  }
  apiExe.stdin.write(path);
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
            self.driversList = [];
            self.driversList = JSON.parse(data.toString('utf-8'));
            //    console.log(self.driversList);
            var dl = document.querySelector('drivers-list');
            resetDriverList(dl);
            dl.set('driversData',self.driversList);

          });
  function resetDriverList(dl) {
    dl.set('driversData',[]);
    dl.set('orderDrivers',[]);
  }

};

module.exports = new  DriversApi() ;

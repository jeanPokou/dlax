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
  //  this.dbPath = 't:/TDSM_Wdistech/dbf/driver.dbf~';
  this.dbPath = 'c:/tdsm_W/dbf/driver.dbf~';

}
util.inherits(DriversApi,events);

function resetDriverList(dl) {
    dl.set('driversData',[]);
    dl.set('orderDrivers',[]);
  }

DriversApi.prototype.loadDrivers = function(path) {
  // return if path is empty
  if (path === '') {
    return ;
  }

  if (util.isNullOrUndefined(path)) {
    path = dbPath + 'getDrivers\n';
  } else {
    path = path + 'getDrivers\n';
  }
  apiExe.stdin.write(path);
  var self = this;
  var driversJson = '';

  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {
    driversJson += data.toString('utf-8');

    if (trailingNewline(data.toString('utf-8'))) {
      self.emit('driversLoaded',driversJson);

    }

  });

  self.on('driversLoaded',function(data) {
            console.log('in drivers');
            self.driversList = [];
            self.driversList = JSON.parse(data.toString('utf-8'));
            //    console.log(self.driversList);
            var dl = document.querySelector('drivers-x');
            resetDriverList(dl);
            dl.set('driversData',self.driversList);

          });

};

DriversApi.prototype.greet = function() {
  console.log('hello');
};

DriversApi.prototype.editDriver = function(id, data) {
  var arr = [];
  arr.push(data);
  // console.log(JSON.stringify(arr));
  if (util.isArray(arr)) {
    // console.log('in edit');
    var args = this.dbPath + 'editDrivers~' + id + '~' +  JSON.stringify(arr) + '\n';
    // console.log(args);
    apiExe.stdin.write(args);

    // apiExe.stdin.write('c:/tdsm_w/dbf/driver.dbf~editDrivers~0324~[{"firstName":"pokou"}]\n');
  }
};

module.exports = new  DriversApi() ;

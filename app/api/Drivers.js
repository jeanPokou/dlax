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
  var self = this;
  self.driversList = [] ;
  self.dataStreamed = '';
 // self.dbPath = 't:/tdsm_Wdistech/dbf/driver.dbf~Driver~';
 self.dbPath = 't:/tdsm_Werb/dbf/driver.dbf~Driver~';

  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {

    self.dataStreamed += data.toString('utf-8');

    if (trailingNewline(data.toString('utf-8'))) {
      var header = self.dataStreamed.split('~')[0];
      var response = self.dataStreamed.split('~')[1];
      console.log(response);
      if (header === 'getDrivers') {
        self.emit('driversLoaded',response);
      }
      if (header === 'getMissingLogs') {
        console.log('emiting missingsLogs');
        self.emit('missingsLogLoaded',response);
      }

    }

  });

  self.on('driversLoaded',function(data) {
              console.log('in drivers');
              this.driversList = [];
              self.driversList = JSON.parse(data.toString('utf-8'));
              //    console.log(self.driversList);
              var dl = document.querySelector('drivers-x');
              resetDriverList(dl);
              dl.set('driversData',self.driversList);

            });

  self.on('missingsLogLoaded',function(data) {
      console.log('in missingsLogLoaded');
      var ml = document.querySelector('#mlogs');
      ml.set('data',JSON.parse(data.toString('utf-8')));
    });

}
util.inherits(DriversApi,events);

function resetDriverList(dl) {
    dl.set('driversData',[]);
    dl.set('orderDrivers',[]);
  }

DriversApi.prototype.loadDrivers = function(path) {
  // return if path is empty
  this.dataStreamed = '';
  if (path === '') {
    return ;
  }

  if (util.isNullOrUndefined(path)) {
    path = this.dbPath + 'getDrivers\n';
  } else {
    path = path + 'getDrivers\n';
  }

  apiExe.stdin.write(path);
};

DriversApi.prototype.greet = function() {
  console.log('hello');
};

DriversApi.prototype.editDriver = function(id, data) {
  this.dataStreamed = '';
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
DriversApi.prototype.getMissingLogs = function(id) {
  this.dataStreamed = '';
  var  args = this.dbPath + 'getMissingLogs~' + id + '\n';
  apiExe.stdin.write(args);

};

module.exports = new  DriversApi() ;

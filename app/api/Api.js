// (function() {
//   var childProcess = require('child_process');
//   var oldSpawn = childProcess.spawn;
//   function mySpawn() {
//     console.log('spawn called');
//     console.log(arguments);
//     var result = oldSpawn.apply(this, arguments);
//     return result;
//   }
//   childProcess.spawn = mySpawn;
// })();

var spawn = require('child_process').spawn;
var util = require('util');
var events = require('async-node-events');
var trailingNewline = require('trailing-newline');
var encoder = require('./encode.js');
var fs = require('fs');
var configstore = require('configstore');
var config = require(__dirname + '/userConfig.js');

var userConfig = new configstore(config.name);



var apiExe = spawn(__dirname + '/dataLayer/dataRequestModule.exe',
[]);

function  Api() {
  // events.call(this);
  var self = this;
  self.Drivers = require('./drivers.js');
  self.Login = require('./Login');
  self.dataStreamed = '';
  self._dbPath = '';
  self.dbPath = self._dbPath + 'driver.dbf~Drivers~';
  // listener for spawn  data event
  apiExe.stdout.on('data',function(data) {

    self.dataStreamed += data.toString('utf-8');
    // console.log('hello' + self.dataStreamed);
    if (trailingNewline(data.toString('utf-8'))) {
      try {
        self.dataStreamed = encoder.decode64(self.dataStreamed);
      } catch (e) {
          console.log(self.dataStreamed);
      }

      var moduleName = self.dataStreamed.split('~')[0];
      var functionName = self.dataStreamed.split('~')[1];
      var response = self.dataStreamed.split('~')[2];
      //   console.log(moduleName + '~' + functionName + '~' + response);
      if (!util.isNullOrUndefined(functionName)) {
        self[moduleName][functionName](response);
      }

    }

  });

}

Api.prototype.rememberMe = function (remember,username,password) {
    if(remember){
    userConfig.set('username',username);
    userConfig.set('password',password);
    }
};
Api.prototype.getConfig = function (attr) {
    return  userConfig.get(attr);
};
// util.inherits(Api,events);
Api.prototype.checkDBPath = function(val) {
  try {
    fs.accessSync(val, fs.F_OK);
    console.log(val + '\carrierInfo.DBF');
    if(fs.statSync(val + '\carrierInfo.DBF').isFile()){
        userConfig.set('dbPath',val);
        return true;
    }else {
        return false;
    }


  } catch (e) {
      return false;
  }
};
Api.prototype.run = function(args) {
  this.dataStreamed = '';
  args = encoder.encode64(args);
  apiExe.stdin.write(args + '\n');
};

Api.prototype.getDriver = function(id) {
  var args = this._dbPath +  'driver.dbf~Drivers~' + 'getDriver~' + id;
  this.run(args);
};

Api.prototype.loadDrivers = function(args) {
  args = this._dbPath + 'driver.dbf~Drivers~' + 'getDrivers';
  console.log(args);
  this.run(args);
};

Api.prototype.checkLogin = function(username, password) {
  var  args = this._dbPath + '/tdpw.dbf' + '~Login~checkCredential~' +
  username + '~' + password + '~' + this._dbPath ;
  this.run(args);
};

Api.prototype.editDriver = function(id, data) {
  //delete data.missingLogs;
  var arr = [];
  arr.push(data);
  console.log(data);
  var args = this._dbPath + 'driver.dbf~Drivers~' + 'editDriver~' + id + '~' +
   JSON.stringify(arr);
  this.run(args);

};

module.exports = new  Api() ;

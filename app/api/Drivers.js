var Drivers = module.exports = {};
Drivers.list = [];

Drivers.getDrivers = function(data) {
  console.log('in drivers');
  Drivers.list = [];
  Drivers.list = JSON.parse(data.toString('utf-8'));
  var dl = document.querySelector('drivers-x');
  if (dl !== null) {
    dl.$.driversList.$.listSpinner.active = false;
    dl.set('driversData',Drivers.list);
  }
};

Drivers.getDriver = function(data) {
  console.log('in get Driver');
  var arr = JSON.parse(data);
  var dl = document.querySelector('driver-profile');
  if (dl !== null) {
    dl.set('driverData',arr[0]);
  }
};

Drivers.editDriver = function(data) {
  console.log(data);
  console.log('in edit driver');
  document.querySelector('#toastUpdated').text = data;
  document.querySelector('#toastUpdated').open();
};

var Login = module.exports = {};

Login.login = function(data) {

  if (data !== '') {
     console.log(__dirname);
    if (data.split('-')[1].trim() === 'ACCESS GRANTED') {
        var app=document.querySelector('#app')
        app.selected=1;
    } else {

      var dl = document.querySelector('dlax-login');
      if (dl !== null) {
        dl.message = data.split('-')[1].trim();
      }
    }
  }
};

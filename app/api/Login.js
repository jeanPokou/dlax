var Login = module.exports = {};
Login.login = function(data) {

  if (data !== '') {
     console.log(__dirname);
    if (data.split('-')[1].trim() === 'ACCESS GRANTED') {
        var app=document.querySelector('#app');        // save password
        var login = document.querySelector('dlax-login');
        if(login.remember){
        window.localStorage.setItem('username',login.username);
        window.localStorage.setItem('password',login.password);
        window.localStorage.setItem('remember',login.remember);
     }
     else {
             window.localStorage.removeItem('username');
             window.localStorage.removeItem('password');
             
     }
        app.selected=1;
    } else {

      var dl = document.querySelector('dlax-login');
      if (dl !== null) {
        dl.message = data.split('-')[1].trim();
      }
    }
  }
};

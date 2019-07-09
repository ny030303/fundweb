class User {
  constructor() {
     this.user = null;
  }

  getUser() {
    $.getJSON("php/check_login.php").done(jsonRes => {
      if(jsonRes.result == 0) {
        this.user = null;
      } else {
        this.user = jsonRes.user;

        if( this.user.email == 'admin') {
          this.user.money = 10000000;
        }
        else {
          this.user.money = parseInt(this.user.money);
        }
      }
      
    });
    return this.user;
  }
}

let g_User = new User;
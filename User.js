class User {
  constructor() {
     this.user = {
       email: 'admin',
       name: '홍길동',
       money: 5000000
     };
  }

  getUser() {
    // return this.user;
    return this.getUserFromDB();
  }

  getUserFromDB() {
    $.getJSON("php/check_login.php").done(jsonRes => {
      if(jsonRes.result == 0) {
        this.user = null;
      } else {
        this.user = jsonRes.user;

        if( this.user.email == 'admin') {
          this.user.money = 5000000;
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
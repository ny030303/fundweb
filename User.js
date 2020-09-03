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
      }
      
    });
    return this.user;
  }
}

let g_User = new User;
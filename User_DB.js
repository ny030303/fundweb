class User {
  constructor() {
    this.user = null;
  }

  getUser(email, pwd) {
    if( email != null && pwd != null) {
      $.getJSON(`php/check_login.php?email=${loginInputs[0].value}&pwd=${loginInputs[1].value}`).done(JsonValue => {
        if (JsonValue.result == 1) {
          this.user = JsonValue.user;
          this.user.money = parseInt(this.user.money);
        }
      });
    }
    return this.user;
  }

  putUser(user) {
    console.log(user);
    let retValue = 0;
    $.getJSON(`php/create_user.php?email=${user.email}&name=${user.name}&pwd=${user.pwd}`).done(JsonValue => {
      retValue = JsonValue.result;
    });
    return retValue;
  }
}

let g_User = new User;
class User {
  constructor() {
    this.user = null;
  }

  getUser(email, pwd) {
    if( email != null && pwd != null) {
      $.getJSON(`php/get_user.php?email=${email}&pwd=${pwd}`).done(jsRes => {
        if (jsRes.result == 1) {
          this.user = jsRes.user;
          this.user.money = parseInt(this.user.money);
        }
      });
    }
    return this.user;
  }

  getName(email) {
    let name = $.getJSON(`php/get_name.php?email=${email}`).done(jsRes => jsRes.name || 'Unknown');
    return name;
  }

  addUserMoney(money, email) {
    if( money != null && email != null ) {
      $.post('php/add_user_money.php', {money: money, email: email}).done(jsRes => console.log(jsRes));
    }
  }

  putUser(user) {
    let retValue = 0;
    $.getJSON(`php/create_user.php?email=${user.email}&name=${user.name}&pwd=${user.pwd}`).done(JsonValue => {
      retValue = JsonValue.result;
    });
    return retValue;
  }
}

let g_User = new User;
class User {
  constructor() {
    this.user = null; // 로그인한 유저 정보
    this.userArr = [  // 유저 전체 정보
      {email: 'admin', pwd: 1234, name: '관리자', money: 3000000}
    ];

    let loadData = localStorage.getItem('userArr');
    if( loadData ) {
      this.userArr = JSON.parse(loadData);
    }
    else {
      // JSON 파일에서 email을 가져와서 유저 배열에 등록.
      $.getJSON("fund.json").done(jsvalue => {
        jsvalue.forEach(fund => {
          this.putUser({email: fund.owner, pwd: 1234, name: `홍길동${this.userArr.length}`, money: 50000});
          
          fund.investorList.forEach(investor => {
            this.putUser({email: investor.email, pwd: 1234, name: `홍길동${this.userArr.length}`, money: 50000});
          });
        });
      });
    }
  }

  saveLocalData() {
    localStorage.setItem('userArr', JSON.stringify(this.userArr));
  }

  getUser(email, pwd) {
    if( email != null && pwd != null) {
      let idx = this.userArr.findIndex((value) => (value.email == email && value.pwd == pwd));
      if( idx >= 0 ) {
        // 유저 정보를 찾음
        this.user = this.userArr[idx];
      }
    }
    return this.user;
  }

  getName(email) {
    let retName = 'Unknwon';
    let idx = this.userArr.findIndex((value) => value.email == email);
    if (idx >= 0) {
      retName = this.userArr[idx].name;
    }
    return retName;
  }

  addUserMoney(money, email) {
    if( email ) { // 이메일이 입력되면 해당 유저의 보유돈을 갱신
      let idx = this.userArr.findIndex((value) => value.email == email);
      if (idx >= 0) { // 찾아서 없을 때만 추가
        this.userArr[idx].money += money;
      }
    }
    else {
      // 이메일이 없으면 로그인한 자신의 보유돈을 갱신
      this.user.money += money;
    }
  }

  putUser(user) {
    let idx = this.userArr.findIndex((value) => value.email == user.email);
    if (idx < 0) { // 찾아서 없을 때만 추가
      if( user.money === undefined ) {
        // 가입하면 기본값 50000원 지급
        user.money = 50000;
      }
      this.userArr.push(user);
    }
  }
}

let g_User = new User;
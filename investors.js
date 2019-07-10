class Investors {
  constructor() {
    this.investorArr = [];
    this.sortType = 0;
    this.nPage = 0;
    this.divide = 5.0;

    let loadData = localStorage.getItem('investorArr');
    if( loadData ) {
      this.investorArr = JSON.parse(loadData);
    }
    else {
      $.getJSON("fund.json").done(jsvalue => {
        jsvalue.forEach((fund) => {
          fund.investorList.forEach(investor => this.putInvestor({
            number: fund.number,
            email: investor.email,
            fname: fund.name,
            uname: null,
            sign: null,
            total: fund.total,
            money: investor.pay,
            investtm: new Date(investor.datetime).getTime()
          }));
        });
      });
    }
  }

  saveLocalData() {
    localStorage.setItem('investorArr', JSON.stringify(this.investorArr));
  }

  setInvestorSortType(type) {
    this.sortType = type; // 0: 최근등록순, 1: 펀드별, 2: 개인별
    this.nPage = 0;
  }

  getPageCount() {
    return Math.floor((this.getCount() + this.divide - 1) / this.divide);
  }

  getCount() {
    return this.investorArr.length;
  }

  getInvestors() {
    let sortArr = JSON.parse(JSON.stringify(this.investorArr));
    switch (this.sortType) {
      case 0: // 최근등록순
        sortArr.sort((a, b) => a.investtm > b.investtm ? -1 : 1);
        break;
      case 1: // 펀드별
        sortArr.sort((a, b) => a.number < b.number ? -1 : 1);
        break;
      case 2: // 개인별
        sortArr.sort((a, b) => a.email > b.email ? -1 : 1);
        break;
    }
    let retInvestorArr = [];
    for (let i = this.nPage * 5; i < sortArr.length && retInvestorArr.length < 5; i++) {
      retInvestorArr.push(sortArr[i]);
    }
    return retInvestorArr;
  }

  putInvestor(investor) {
    let idx = this.investorArr.findIndex(v => v.number == investor.number && v.email ==investor.email);
    if (idx >= 0) {
      investor.money += this.investorArr[idx].money;
      investor = Object.assign(this.investorArr[idx], investor);
      this.investorArr.splice(idx, 1);
    }
    this.investorArr.push({
      number: investor.number,
      email: investor.email,
      fname: investor.fname,
      uname: investor.uname,
      sign: investor.sign,
      total: investor.total,
      money: investor.money,
      percent: Math.floor(100 * investor.money / investor.total),
      investtm: investor.investtm || (new Date().getTime())
    });
    //this.investorArr.sort((a, b) => a.createtm > b.createtm ? -1 : 1);
  }

  getInvestor(number, email) {
    let idx = this.investorArr.findIndex(v => v.number == number && v.email == email);
    return idx < 0 ? null : this.investorArr[idx];
  }

  getInvestorFromFund(number) {
    let retArr = [];
    this.investorArr.forEach(value => {
      if (value.number == number) {
        retArr.push(value);
      }
    });
    return retArr;
  }

  getFundNumbersFromInvestor(email) {
    let retArr = [];
    this.investorArr.forEach(value => {
      if (value.email == email) {
        retArr.push(value.number);
      }
    });
    return retArr;
  }

  // C모듈 기능
  deleteFund(number) {
    for( let i = this.investorArr.length-1; i>=0; i--) {
      if (this.investorArr[i].number == number) {
        this.investorArr.splice(i, 1);
      }
    }
  }
}

g_Investors = new Investors();
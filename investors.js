class Investors {
  constructor() {
    this.investorArr = [];
    this.sortType = 0;
    this.nPage = 0;
    this.divide = 5.0;

    $.getJSON("fund.json").done(jsvalue => {
      jsvalue.forEach((value, idx) => {
        value.investorList.forEach(investor => this.putInvestor({
          number: value.number,
          email: investor.email,
          fname: value.name,
          uname: investor.email,
          sign: null,
          total: value.total,
          money: investor.pay,
          investtm: new Date(investor.datetime).getTime()
        }));
      });
    });
  }

  setInvestorSortType(type) {
    this.sortType = type;
    this.nPage = 0;
  }

  getCount() {
    return this.investorArr.length;
  }

  findInvestor(fundNumber, userEmail) {
    let idx = this.investorArr.findIndex(investor => {
      return (investor.number === fundNumber && investor.email === userEmail)
    });
    return idx;
  }

  getInvestors() {
    let sortArr = JSON.parse(JSON.stringify(this.investorArr));
    switch (this.sortType) {
      case 0:
        sortArr.sort((a, b) => a.percent > b.percent ? -1 : 1);
        break;
      case 1:
        sortArr.sort((a, b) => a.number < b.number ? -1 : 1);
        break;
      case 2:
        sortArr.sort((a, b) => a.investtm > b.investtm ? -1 : 1);
        break;
    }
    let retInvestorArr = [];
    for (let i = this.nPage * 5; i < sortArr.length && retInvestorArr.length < 5; i++) {
      retInvestorArr.push(sortArr[i]);
    }
    return retInvestorArr;
  }

  putInvestor(newInvestor) {
    let idx = this.findInvestor(newInvestor.number, newInvestor.email);
    if (idx >= 0) {
      newInvestor.money += this.investorArr[idx].money;
      newInvestor = Object.assign(this.investorArr[idx], newInvestor);
      this.investorArr.splice(idx, 1);
    }
    this.investorArr.push({
      number: newInvestor.number,
      email: newInvestor.email,
      fname: newInvestor.fname,
      uname: newInvestor.uname,
      sign: newInvestor.sign,
      total: newInvestor.total,
      money: newInvestor.money,
      percent: Math.floor(100 * newInvestor.money / newInvestor.total),
      investtm: newInvestor.investtm || (new Date().getTime())
    });
    this.investorArr.sort((a, b) => a.createtm > b.createtm ? -1 : 1);
  }

  getInvestor(fundNumber, userEmail) {
    let idx = this.findInvestor(fundNumber, userEmail);
    return idx < 0 ? null : this.investorArr[idx];
  }

  getInvestorFromFund(number) {
    let retArr = [];
    this.investorArr.forEach(value => {
      if (value.number == number) {
        if (!value.uname) value.uname = 'unknown';
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
}

g_Investors = new Investors();
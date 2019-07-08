class Investors {
  constructor() {
    this.investorArr = [];
    this.sortType = 0;

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
  }

  getInvestorCount() {
    return this.investorArr.length;
  }

  findInvestor(fundNumber, userEmail) {
    let idx = this.investorArr.findIndex(investor => {
      return (investor.number === fundNumber && investor.email === userEmail)
    });
    return idx;
  }

  getInvestors(page = 0) {        
    if( this.sortType == 0 ) {
      return this.getInvestorsOrderByPercent(page);
    }
    else if( this.sortType == 1) {
      return this.getInvestorsOrderByFundNumber(page);
    }
    else if( this.sortType == 2) {
      return this.getInvestorsOrderByDatetime(page);
    }
  }

  getInvestorsOrderByPercent(page = 0) {
    console.log('getInvestorsOrderByFundNumber() - sortType=', this.sortType);
    let sortArr = JSON.parse(JSON.stringify(this.investorArr));
    sortArr.sort((a, b) => a.percent > b.percent ? -1 : 1);
    let retInvestorArr = [];
    for (let i = page * 10; i < sortArr.length && sortArr.length < 10; i++) {
      retInvestorArr.push(sortArr[i]);
    }
    return retInvestorArr;
  }
  
  getInvestorsOrderByFundNumber(page = 0) {
    console.log('getInvestorsOrderByFundNumber() - sortType=', this.sortType);
    let sortArr = JSON.parse(JSON.stringify(this.investorArr));
    sortArr.sort((a, b) => a.number < b.number ? -1 : 1);
    let retInvestorArr = [];
    for (let i = page * 10; i < sortArr.length && sortArr.length < 10; i++) {
      retInvestorArr.push(sortArr[i]);
    }
    return retInvestorArr;
  }

  getInvestorsOrderByDatetime(page = 0) {    
    console.log('getInvestorsOrderByDatetime() - sortType=', this.sortType)
    let sortArr = JSON.parse(JSON.stringify(this.investorArr));
    sortArr.sort((a, b) => a.investtm < b.investtm ? -1 : 1);
    let retInvestorArr = [];
    for (let i = page * 10; i < sortArr.length && sortArr.length < 10; i++) {
      retInvestorArr.push(sortArr[i]);
    }
    return retInvestorArr;
  }

  putInvestor(newInvestor) {
    let idx = this.findInvestor(newInvestor.number , newInvestor.email);
    if (idx >= 0) {
      newInvestor.money += this.investorArr[idx].money;
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
      createtm: new Date().getTime()
    });
    this.investorArr.sort((a, b) => a.createtm > b.createtm ? -1 : 1);
  }

  getInvestor(fundNumber, userEmail) {
    let idx = this.findInvestor(fundNumber, userEmail);
    return idx < 0 ? null : this.investorArr[idx];
  }

  getInvestorFromFund(number) {
    let retArr =[];
    this.investorArr.forEach(value => {
     if(value.number == number) {
      if( !value.uname ) value.uname = 'unknown';
      retArr.push(value);
     };

   })
    return retArr;
  }

  getFundNumbersFromInvestor(email) {
    let retArr =[];
    this.investorArr.forEach(value => {
     if(value.email == email) {      
      retArr.push(value.number);
     };

   })
    return retArr;
  }
}
g_Investors = new Investors();
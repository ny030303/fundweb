class Investors {
  constructor() {
    this.investorArr = [];
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
    let retInvestorArr = [];
    for (let i = page * 10; i < this.investorArr.length && retInvestorArr.length < 10; i++) {
      retInvestorArr.push(this.investorArr[i]);
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

function convertInvestorFromDB(investor) {
  return {
    number: investor.number,
    email: investor.email,
    fname: investor.name,
    uname: investor.uname,
    sign: investor.sign,
    total: parseInt(investor.total),
    money: parseInt(investor.money),
    percent: Math.floor(100 * parseInt(investor.money) / parseInt(investor.total))
  };
}


class Investors {
  constructor() {
    this.investorArr = [];
  }

  getCount() {
      let count = 0;
      $.getJSON("php/get_count.php").done(jsRes => {
        if(jsRes.result) {
          count = jsRes.investor;
        }
      });
      return count;
  }

  findInvestor(fundNumber, userEmail) {
    return 0;
  }

  getInvestors(page = 0) {
    let returnArr = [];
    $.getJSON(`php/get_investors.php?page=${page}`).done(jsRes => {
      if(jsRes.result) {
       jsRes.datas.forEach(investor => returnArr.push(convertInvestorFromDB(investor)));
      }
    })
    return returnArr;
  }

  putInvestor(newInvestor) {
    let res = 0;
    $.post("php/put_investor.php", newInvestor).done( jsRes => {
      console.log(jsRes);
      res = jsRes.result;
    });

    return res;
  }

  getInvestor(fundNumber, userEmail) {
    let returnInvestor = null;
    $.getJSON(`php/get_investor.php?email=${userEmail}`).done(jsRes => {
      if(jsRes.result) {
        jsRes.datas.forEach( investor => {
          if(investor.number == fundNumber) {
            returnInvestor = convertInvestorFromDB(investor);
          }
        });
      }
    })
    return returnInvestor;
  }

  getInvestorFromFund(number) {
    let retArr =[];
    $.getJSON(`php/get_investor_from_fund.php?number=${number}`).done(jsRes => {
      if(jsRes.result) {
        jsRes.datas.forEach( investor => {
          retArr.push(convertInvestorFromDB(investor));
        });
      }
    })
   
    return retArr;
  }

  getFundNumbersFromInvestor(email) {
    let retArr =[];
    $.getJSON(`php/get_investor.php?email=${email}`).done(jsRes => {
      if(jsRes.result) {
        jsRes.datas.forEach( investor => {
          retArr.push(investor.number);
        });
      }
    })
    return retArr;
  }


}
g_Investors = new Investors();
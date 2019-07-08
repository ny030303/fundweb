function convertFundFromDB(fund) {
  return {
    number: fund.number,
    name: fund.name,
    enddate: fund.endDate || fund.enddate,
    total: parseInt(fund.total),
    current:  parseInt(fund.current),
    percent: Math.floor(100 * parseInt(fund.current) / parseInt(fund.total))
  };
}

class Funds {
  constructor() {
    
  }

  getFundCount() {
    let count = 0;

    $.getJSON("php/get_count.php").done(jsRes => {
      if(jsRes.result) {
        count = jsRes.fund;
      }
    });
    return count;
  }

  // 펀드 Percent에 따라 정렬 후 상위 4개만 전달
  getRankFunds() {
    let rankArr = [];
   $.getJSON("php/get_rankfunds.php").done(jsRes => {
     if(jsRes.result) {
      jsRes.datas.forEach(fund => rankArr.push(convertFundFromDB(fund)));
     }
   })
    return rankArr;
  }

  // 페이지에 해당하는 10개의 데이터를 전달
  getFunds(page = 0) {
    let retFundArr = [];
    $.getJSON(`php/get_funds.php?page=${page}`).done(jsRes => {
      if(jsRes.result) {
       jsRes.datas.forEach(fund => retFundArr.push(convertFundFromDB(fund)));
      }
    })
    return retFundArr;
  }

  getFund(fundNumber) {
    let fund = null;
    $.getJSON(`php/get_fund.php?number=${fundNumber}`).done(jsRes => {
      if(jsRes.result) {
        fund = jsRes.fund[0];
      }
    })
    return convertFundFromDB(fund);
  }

  putFund(newFund) {
    // 펀드 번호가 동일한 데이터가 입력되면 이전 데이터를 삭제 후 입력함.
    let res = 0;
    $.post("php/put_fund.php", newFund).done( jsRes => {
      console.log(jsRes);
      res = jsRes.result;
    });

    return res;
  };

  getFundFromCreator(email) {
    let fundArr = [];
    $.getJSON(`php/get_fund_from_email.php?email=${email}`).done(jsRes => {
      if(jsRes.result) {
        jsRes.datas.forEach(fund => fundArr.push(convertFundFromDB(fund)));
       }
    });
    return fundArr;
  }

  getFundFromComplete(email) {
    let fundArr = [];
    this.getFundFromCreator(email).forEach(fund => {
      if(fund.percent == 100) {
        fundArr.push(fund);
      }
    });
    return fundArr;
  }
}

g_Funds = new Funds();

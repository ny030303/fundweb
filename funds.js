class Funds {
  constructor() {
    this.fundArr = [];
    this.nPage = 0;
    this.divide = 10.0;

    $.getJSON("fund.json").done(jsvalue => {
      jsvalue.forEach((value, idx) => this.putFund(value));
    });
  }

  getCount() {
    return this.fundArr.length;
  }

  // 펀드 Percent에 따라 정렬 후 상위 4개만 전달
  getRankFunds() {
    let sortArr = [];
    this.fundArr.forEach((value, i) => {
      sortArr.push({percent: value.percent, index: i, current: value.current, total: value.total});
    });
    sortArr.sort((a, b) => a.percent > b.percent ? -1 : 1);

    let rankArr = [];
    for( let i =0; i < 4 && i < this.fundArr.length; i++) {
      rankArr.push(this.fundArr[sortArr[i].index])
    }
    // [0, 1, 2, 3].forEach(i => );
    // console.log(rankArr);
    return rankArr;
  }

  // 페이지에 해당하는 10개의 데이터를 전달
  getFunds() {
    let retFundArr = [];
    for (let i = this.nPage * 10; i < this.fundArr.length && retFundArr.length < 10; i++) {
      retFundArr.push(this.fundArr[i]);
    }
    return retFundArr;
  }

  getFund(fundNumber) {
    let idx = this.fundArr.findIndex(fund => fund.number === fundNumber);
    return (idx < 0) ? null : this.fundArr[idx];
  }

  putFund(newFund) {
    // 펀드 번호가 동일한 데이터가 입력되면 이전 데이터를 삭제 후 입력함.
    let idx = this.fundArr.findIndex(fund => fund.number === newFund.number);
    if( idx >= 0) { // 이전펀드가 존재하면 값을 갱신함.
      // 투자로 인해서 Put되는 경우 현재값을 더해줌
      this.fundArr[idx].current += newFund.current;
      // 투자율 재계산
      this.fundArr[idx].percent = Math.floor(100 * this.fundArr[idx].current / this.fundArr[idx].total);
    }
    else { // 펀드가 없으면 새로 만듦.
      // 펀드를 새로 만들어서 Put되는 경우 초기 투자값이 없어서 0으로 초기화
      if (newFund.current === undefined) newFund.current = 0;
      this.fundArr.push({
        number: newFund.number,
        name: newFund.name,
        enddate: newFund.endDate || newFund.enddate,
        total: newFund.total,
        current: newFund.current,
        percent: Math.floor(100 * newFund.current / newFund.total),
        owner: newFund.owner
      });
    }
  }
  getFundFromCreator(email) {
    return this.fundArr;
  }
  getFundFromComplete(email) {
    return this.fundArr;
  }
}

g_Funds = new Funds();

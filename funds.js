class Funds {
  constructor() {
    this.fundArr = [];
  }

  getFundCount() {
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
  getFunds(page = 0) {
    let retFundArr = [];
    for (let i = page * 10; i < this.fundArr.length && retFundArr.length < 10; i++) {
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
    if (idx >= 0) {
      this.fundArr.splice(idx, 1);
    }
    if (newFund.current === undefined) newFund.current = 0;
    this.fundArr.push({
      number: newFund.number,
      name: newFund.name,
      enddate: newFund.endDate || newFund.enddate,
      total: newFund.total,
      current: newFund.current,
      percent: Math.floor(100 * newFund.current / newFund.total)
    });
  }
  getFundFromCreator(email) {
    return this.fundArr;
  }
  getFundFromComplete(email) {
    return this.fundArr;
  }
}

g_Funds = new Funds();

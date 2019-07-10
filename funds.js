class Funds {
  constructor() {
    this.fundArr = [];
    this.completeFundArr = [];
    this.nPage = 0;
    this.divide = 10.0;

    let loadData = localStorage.getItem('fundArr');
    if (loadData) {
      this.fundArr = JSON.parse(loadData);
    }
    else {
      $.getJSON("fund.json").done(jsvalue => {
        jsvalue.forEach((value, idx) => this.putFund(value));
      });
    }

    let completeFundData = localStorage.getItem('completeFundArr');
    this.completeFundArr = loadData ? JSON.parse(completeFundData) : [];
  }

  saveLocalData() {
    localStorage.setItem('fundArr', JSON.stringify(this.fundArr));
    localStorage.setItem('completeFundArr', JSON.stringify(this.completeFundArr));
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
    for (let i = 0; rankArr.length < 4 && i < this.fundArr.length; i++) {
      let fund = this.fundArr[sortArr[i].index];
      if( new Date(fund.enddate).getTime() > new Date().getTime()) {
        // 마감일이 지나지 않은 펀드만 Rank에 추가
        rankArr.push(fund);
      }
    }
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
    let idx = this.fundArr.findIndex(fund => fund.number == fundNumber);
    return (idx < 0) ? null : this.fundArr[idx];
  }

  putFund(newFund) {
    // 펀드 번호가 동일한 데이터가 입력되면 이전 데이터를 삭제 후 입력함.
    let idx = this.fundArr.findIndex(fund => fund.number == newFund.number);
    if (idx >= 0) { // 이전펀드가 존재하면 값을 갱신함.
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
        owner: newFund.owner || newFund.email,
      });
    }
  }

  // C모듈 기능
  completeFund(fundNumber) {
    let idx = this.fundArr.findIndex(fund => fund.number === fundNumber);
    if (idx >= 0) { // 찾지 못했을 경우 예외처리
      this.completeFundArr.push(this.fundArr[idx]);
      this.fundArr.splice(idx, 1);
    }
  }

  // C모듈 기능
  deleteFund(fundNumber) {
    let idx = this.fundArr.findIndex(fund => fund.number === fundNumber);
    if (idx >= 0) { // 찾지 못했을 경우 예외처리
      this.fundArr.splice(idx, 1);
    }
  }

  // C모듈 기능
  getFundFromCreator(email) {
    let retFunds = [];
    this.fundArr.forEach(fund => {
      if (fund.owner == email) {
        retFunds.push(fund);
      }
    });
    return retFunds;
  }

  // C모듈 기능
  getFundFromComplete(email) {
    let retFunds = [];
    this.completeFundArr.forEach(fund => {
      if (fund.owner == email) {
        retFunds.push(fund);
      }
    });
    return retFunds;
  }
}

g_Funds = new Funds();

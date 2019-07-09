
let g_bInvestorSign = false;

Number.prototype.toCurrency = function () {
  return Number(this).toLocaleString('kr', 'currency');
};

Date.prototype.toMyDateString = function() {
  return this.toISOString().substr(0, '0000-00-00 00:00:00'.length).replace('T', ' ');
};

function showAlert(msg) {

  let toastContainer = document.querySelector("#toastList");
  let div = document.createElement("div");
  div.classList.add("toast");

  let template = `<p class="msg">${msg}</p><span class="close">&times;</span>`;
  div.innerHTML = template;
  let closeTimer = setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => {
      toastContainer.removeChild(div);
    }, 700);
  }, 2500); //2.5초후에 자동으로 사라짐

  div.querySelector(".close").addEventListener("click", () => {
    clearTimeout(closeTimer);
    div.style.opacity = 0;
    setTimeout(() => {
      toastContainer.removeChild(div);
    }, 700);
  });
  toastContainer.appendChild(div);

}

function investFund() {
  let inputs = $("#pageContents").find("input");
  let fund = g_Funds.getFund(inputs[0].value);
  let investMoney = parseInt(inputs[3].value || '0');

  if (investMoney == 0) {
    showAlert(`투자금액을 입력해주세요.`);
    return;
  }

  if ((fund.total - fund.current) < investMoney) {
    showAlert(`투자금액이 투자금액을 초과할 수 없습니다. (최대 투자 가능금액: ${(fund.total - fund.current).toCurrency()}원)`);
    return;
  }

  if (g_User.user.money < investMoney) {
    showAlert(`투자 금액이 부족합니다. (보유 금액: ${g_User.user.money.toCurrency()}원)`);
    return;
  }

  if (!g_bInvestorSign) {
    showAlert(`싸인을 하지 않으셨습니다.`);
    return;
  }

  g_Investors.putInvestor({
    number: fund.number,
    email: g_User.user.email,
    fname: fund.name,
    uname: g_User.user.name,
    sign: $('#pageContents > canvas')[0].toDataURL().toString(),
    total: fund.total,
    money: investMoney
  });
  g_Funds.putFund({
    number: fund.number,
    current: investMoney
  });

  g_User.user.money -= investMoney;
  $('#haveMyMoney').innerText = g_User.user.money.toCurrency();

  closePopupSection("#investPage");
  gotoSectionPage('View');
}

function randomNumber() {
  let text1 = "";
  let text2 = "";

  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let number = "0123456789";
  // console.log(alphabet.charAt(Math.floor(Math.random() * alphabet.length)));
  text1 += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  for (let i = 0; i < 4; i++) {
    text2 += number.charAt(Math.floor(Math.random() * number.length));
  }
  return text1 + text2;
}

function selectFundImage() {
  $("#fundImage").on("change", e => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = res => {
        $('.regDiv1st > img').attr('src', res.target.result);
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  $("#fundImage").click();
}

function closePopupSection(popupSectionId) {
  $(popupSectionId).css({left: "-200%"});
}

function gotoSectionPage(title) {
  let navATag = $(".nav-lists-a");
  for (let i = 0; i < navATag.length; i++) {
    let aTag = navATag[i];
    // console.log(`element.innerText='${aTag.innerText}', title='${title}'`);
    if (aTag.innerText.toLowerCase() == title.toLowerCase()) {
      aTag.click();
    }
  }
}

function clickOffFund() {
  let navATag = $(".login");
  // $(`#rankFund${i} .graph-bar`).css({width: "0%" , transition: "0s"});
  navATag.removeClass("activity");
}

function clickOffFund2() {
  let navATag = $(".signUp");
  // $(`#rankFund${i} .graph-bar`).css({width: "0%" , transition: "0s"});
  navATag.removeClass("activity");
  gotoSectionPage('login');
}

function userInfo() {
  $("#profile").css({left: "0"});
  $("#profile").find("button").on("click", e => {
    let btnText = $(e.target).text();
    let dataTable = $("#dataTable");
    dataTable.empty();
    if (btnText == 'created') {
      console.log(g_User);
      g_Funds.getFundFromCreator(g_User.user.email).forEach(fund => {
        dataTable.append(`<div class="FdataItem">
        <div class="FdataImg"></div>
          <div>${fund.number}</div>
          <div>${fund.name}</div>
          <div>${fund.enddate}</div>
          <div>${fund.total}</div>
          <div>${fund.current}</div>
          <div>${fund.percent}</div>
      </div>`);
      })

    }
    else if (btnText == 'invested') {
      g_Investors.getFundNumbersFromInvestor(g_User.user.email).forEach(number => {
        let fund = g_Funds.getFund(number);
        dataTable.append(`<div class="FdataItem">
          <div class="FdataImg"></div>
            <div>${fund.number}</div>
            <div>${fund.name}</div>
            <div>${fund.enddate}</div>
            <div>${fund.total}</div>
            <div>${fund.current}</div>
            <div>${fund.percent}</div>
          </div>`);
      });
    }
    else if (btnText == 'completed') {
      g_Funds.getFundFromComplete(g_User.user.email).forEach(fund => {
        dataTable.append(`<div class="FdataItem">
          <div class="FdataImg"></div>
            <div>${fund.number}</div>
            <div>${fund.name}</div>
            <div>${fund.enddate}</div>
            <div>${fund.total}</div>
            <div>${fund.current}</div>
            <div>${fund.percent}</div>
          </div>`);
      });
    }
  });
  $("#profile").find("button")[0].click();
}

function onInvestorListSort(type) {
  g_Investors.setInvestorSortType(type);
  gotoSectionPage('investorList');
}

function userLogout() {
  showAlert("로그아웃 됐습니다.");
  setTimeout(() => window.location.href = "php/logout.php", 300);

}

function signInUser() {
  let loginInputs = $(".loginInputs");

  // $.getJSON(`php/check_login.php?email=${loginInputs[0].value}&pwd=${loginInputs[1].value}`).done(JsonValue => {
  fetch(`php/check_login.php?email=${loginInputs[0].value}&pwd=${loginInputs[1].value}`).then(value => value.json()).then(JsonValue => {

    if (JsonValue.result == 1) {
      putUserName(JsonValue.user.name, 0);
      showAlert(`${JsonValue.user.name}님 로그인 되었습니다.`);
      gotoSectionPage('Home');
    }
    else {
      showAlert("옳지 않은 값입니다.")
    }
  });
}

function putUserName(name, num = 1) {
  let nav = document.querySelector("#nav-wrap");
  // let div = document.createElement("div");
  let navATags = nav.querySelectorAll(".nav-lists");
  let user = nav.querySelector(".user-name");
  user.innerHTML = `${name}`;

  if (num == 0) {
    $(navATags[4]).css({display: "none"});
    $(navATags[5]).css({display: "none"});
    $(".user-name").css({display: "block"});
    $(".logout").css({display: "block"});
  }
  else {
    $(navATags[4]).css({display: "list-item"});
    $(navATags[5]).css({display: "list-item"});
    $(".user-name").css({display: "none"});
    $(".logout").css({display: "none"});
  }
};

function signUpUser() {
  let inputs = $("#lRightText2 > .loginInputs");

  console.log(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value);
  fetch(`php/create_user.php?email=${inputs[0].value}&name=${inputs[1].value}&pwd=${inputs[2].value}`).then(value => value.json()).then(JsonValue => {
    if (JsonValue.result == 1) {
      showAlert(`등록되었습니다.`);
      gotoSectionPage('login');
    }
    else {
      showAlert("형식에 맞지 않습니다.");
    }
  })
}

function detailPopup(e) {
  let parent = $(e.target).parent();
  let number = parent[0].id.substr(-5);
  if (parent[0].id.substr(0, 8) == 'rankFund') {
    let idx = parseInt(parent[0].id.substr(-1))
    number = g_Funds.getRankFunds()[idx].number;
  }

  let fund = g_Funds.getFund(number);
  let fundTexts = $(".detailVTexts");

  textArr = [fund.number, fund.name, fund.enddate, fund.total.toCurrency(), fund.current.toCurrency(), fund.percent + "%"];

  let investorList = $("#detailIVTorList");
  investorList.empty();
  g_Investors.getInvestorFromFund(number).forEach(value => {
    investorList.append(
    ` <div style="float: left">${value.uname}</div>
      <div style="float: right">${value.money.toCurrency()}</div>`);
  })
  textArr.forEach((value, idx) => fundTexts[idx].innerHTML = `${textArr[idx]}`);
  $("#detailView").css({left: "0%"});
}


// 그래프 애니메이션에 글자까지 같이 애니메이션 돌려주는 함수
function animateFundDiv(fundDivId, percent, msec, divnum) {
  let graphBar = $(`#${fundDivId} .graph-bar`);
  let percentDiv = $(`#${fundDivId} > div.flex-container > div:nth-child(${divnum || 3}) > div`);

  // console.log('animateFundDiv:', fundDivId, percent, msec);
  // 이전 동작중인 애니메이션 정지와 CSS값 초기화
  graphBar.stop().css({
    width: '0%'
  });
  percentDiv.html('모집율 : 0%');

  // JQuery 애니메이션 실행
  graphBar.animate({
    width: `${percent}%`
  }, {
    duration: msec,
    step: () => { // 애니메이션 동작을 실행하는 곳
      let widthPer = graphBar[0].style.width;
      widthPer = widthPer.substring(0, widthPer.lastIndexOf('.'));
      percentDiv.html(`모집율 : ${widthPer}%`);
    },
    complete: () => { // 애니메이션 동작이 끝났을 때 마지막 값 설정
      graphBar.stop().css({
        width: `${percent}%`
      });
      percentDiv.html(`모집율 : ${percent}%`);
    }
  });
}

function makePagination(fundBox) {
  let pageTarget = fundBox.hasClass('view') ? g_Funds : g_Investors;
  let pageTargetName = fundBox.hasClass('view') ? "view": "investorList";

  let pageHtml = `<div class="${pageTarget.getPage() === 0 ? 'disable' : 'normal'}">＜</div>`;
  for (let i = 0; i < pageTarget.getPageCount(); i++) {
    pageHtml += `<div class="${pageTarget.getPage() === i ? 'active-ball' : 'normal'}">${i + 1}</div>`;
  }
  // 페이지 Index는 0부터 시작 숫자는 1부터 시작이므로 1개 차이가 있음을 고려해야 함.
  pageHtml += `<div class="${pageTarget.getPage() === (pageTarget.getPageCount() - 1) ? 'disable' : 'normal'}">＞</div>`;

  fundBox.find('.pagination').html(pageHtml);

  fundBox.find('.pagination > div').on('click', (e) => {
    if ($(e.target).hasClass('disable')) return;
    let value = $(e.target).html();
    if (value === '＜') {
      pageTarget.setPage(pageTarget.getPage() - 1);
    }
    else if (value === '＞') {
      pageTarget.setPage(pageTarget.getPage() + 1);
    }
    else {
      pageTarget.setPage(Number(value) - 1);
    }
    gotoSectionPage(pageTargetName);
  });
}

function downInvestContract(number, email) {
  let imgBg = new Image;
  let imgSign = null;
  let imageLoadCnt = 0;
  let investor = g_Investors.getInvestor(number, email);
  console.log('downInvestContract()', number, email);

  if (investor.sign) { // 투자자 싸인이 있는 경우
    imgSign = new Image;
    imgSign.src = investor.sign;
    imgSign.onload = () => clickContract(++imageLoadCnt);
  }
  else { // 초기값 입력으로 투자자의 싸인이 없는 경우
    imageLoadCnt++; // 처리된 것으로 해야 클릭 처리를 진행함.
  }

  imgBg.src = 'images/funding.png';
  imgBg.onload = () => clickContract(++imageLoadCnt);

  function clickContract(imgCnt) {
    if (imgCnt < 2) return;

    console.log('imgCnt:', imgCnt, `[${imgBg.width}, ${imgBg.width}]`);
    let canvas = document.createElement('canvas');
    canvas.width = imgBg.width;
    canvas.height = imgBg.height;

    let ctx = canvas.getContext('2d');
    ctx.drawImage(imgBg, 0, 0);
    if( imgSign ) {
      ctx.drawImage(imgSign, imgBg.width - imgSign.width, imgBg.height - imgSign.height);
    }
    ctx.beginPath();
    ctx.font = "20px 맑은고딕";
    ctx.textAlign = "left";
    ctx.fillStyle = "#31333B";
    ctx.fillText(investor.number, 325, 185 + 44 * 0);
    ctx.fillText(investor.fname, 325, 185 + 44 * 1);
    ctx.fillText(investor.uname, 325, 185 + 44 * 2);
    ctx.fillText(investor.money.toCurrency(), 325, 185 + 44 * 3);
    ctx.closePath();

    let downloadALink = document.createElement('a');
    downloadALink.download = 'InvestContract.png';
    downloadALink.href = canvas.toDataURL('image/png');
    downloadALink.click();
  }
}

function refreshFundBox(fundBox) {
  if( g_User.user ) {
    $('#haveMyMoney').text(g_User.user.money.toCurrency());
  }

  if (fundBox.hasClass('mainScreen')) {
    let rankWrappers = document.querySelectorAll(".listWrapper");
    g_Funds.getRankFunds().forEach((fund, i) => {
      let rankDiv = rankWrappers[i].querySelectorAll(".rankText");
      rankDiv[0].innerHTML = `${fund.number}`;
      rankDiv[1].innerHTML = `${fund.name}`;
      rankDiv[2].innerHTML = `모집마감일 : ${fund.enddate}`;
      rankDiv[3].innerHTML = `모집금액 : ${fund.total.toCurrency()}`;
      rankDiv[4].innerHTML = `현재금액 : ${fund.current.toCurrency()}`;
      rankDiv[5].innerHTML = `모집률 : ${Math.floor(fund.current * 100 / fund.total)}%`;

      let transitionTime = 3 * Math.floor(fund.percent) / 100;
      animateFundDiv(`rankFund${i}`, fund.percent, transitionTime * 1000);
    });
  }
  else if (fundBox.hasClass('view')) {

    makePagination(fundBox);

    let fundList1 = document.querySelector(".fundList1");
    $(fundList1).empty();
    g_Funds.getFunds().forEach(value => {

      let divTag = document.createElement('div');
      divTag.innerHTML = `<div id="viewFund${value.number}" class="viewListWrapper">
                            <div class="graph"><div class="graph-bar"></div></div>
                            <div class="form-control1 text-sz1-b" style="font-weight: bold;">${value.number}</div>
                            <div class="fundTexts">${value.name}</div>
                            <div class="fundTexts">${value.enddate}</div>
                            <div class="flex-container">
                                <div>
                                <span class="fundTexts">${value.current.toCurrency()} </span>
                                <span>/</span>
                                <span class="fundTexts">${value.total.toCurrency()}</span>
                                </div>
                                <div>
                                    <div class="fundTexts">${Math.floor(100 * value.current / value.total)}%</div>
                                </div>
                            </div>
                            <button class="buttonStyle investPageBtn">투자하기</button>
                            <button class="buttonStyle detailViewBtn">상세보기 </button>                            
                        </div>`;
      fundList1.appendChild(divTag);
      let transitionTime = 3 * Math.floor(value.percent) / 100;
      animateFundDiv(`viewFund${value.number}`, value.percent, transitionTime * 1000, 2);

      $(divTag).on('click', e => {
        let parent = $(e.target).parent();
        let number = parent[0].id.substr(-5);
        if ($(e.target).text() == '투자하기') {
          // console.log("a");
          let inputs = $("#pageContents").find("input");
          $("#investPage").css({left: "0%"});

          inputs[0].value = number;
          inputs[1].value = g_Funds.getFund(number).name;
          inputs[2].value = g_User.getUser().name;
          inputs[3].value = '';
          clearSignCanvas($('#pageContents > canvas')[0]);
        }
        else {
          // console.log("c");
          detailPopup(e);
        }
      });
    });
  }
  else if (fundBox.hasClass('Register')) {
    let addFundInp = document.querySelectorAll(".form-group .form-control");
    addFundInp.forEach(element => element.value = "");
    addFundInp[0].value = randomNumber();
  }
  else if (fundBox.hasClass('investor')) {
    makePagination(fundBox);
    let investBody = $("#investorInfos");
    investBody.empty();
    g_Investors.getInvestors().forEach(value => {
      investBody.append(`<tr data-email="${value.email}">
      <td width="100px">${value.number}</td>
      <td width="40%">${value.fname}</td>
      <td width="130px">${value.uname}</td>
      <td width="100px">${value.money}</td>
      <td width="250px">${value.percent}%</td>
      <td width="250px">${new Date(value.investtm).toMyDateString()}</td>
      <td width="100px"><button class="buttonStyle">download</button></td>
      </tr>`);
    });
    investBody.find("button").on("click", e => {
      console.log($(e.target).parent().parent().first().text());
      let trTag = $(e.target).parent().parent();
      console.log(trTag);
      let number = trTag.find('td')[0].innerText;
      downInvestContract(number.trim(), trTag.attr('data-email'));
      showAlert("다운로드 완료");
    })
  }
}

function clearSignCanvas(canvas) {
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();
  g_bInvestorSign = false;
}

function initSignCanvas(canvas) {
  let ptPrev = {x: 0, y: 0};
  let isDraw = false;
  let ctx = canvas.getContext('2d');
  let getCanvasPoint = (event) => ({x: event.offsetX, y: event.offsetY});

  ctx.beginPath();

  let eventListener = (event) => {
    // console.log(event);
    // console.log(event.type, event.offsetX, event.offsetY);
    switch (event.type) {
      case 'mousedown':
        ptPrev = getCanvasPoint(event);
        isDraw = true;
        break;

      case 'mousemove':
        if (isDraw) {
          let ptNew = getCanvasPoint(event);
          ctx.moveTo(ptPrev.x, ptPrev.y);
          ctx.lineTo(ptNew.x, ptNew.y);
          ctx.stroke();
          ptPrev = ptNew;
          g_bInvestorSign = true;
        }
        break;

      case 'mouseup':
        isDraw = false;
        ctx.closePath()
        break;
    }
  };
  canvas.onmousedown = eventListener;
  canvas.onmousemove = eventListener;
  document.onmouseup = eventListener;
}

function injectPaginationToClass() {
  // prototype 메소드 같은 function으로 만들어서 기존 prototype에 통합하는 방법
  let pageFuntions = {
      getPageCount: function() {
        return Math.floor((this.getCount() + this.divide - 1) / this.divide);
      },
      getPage: function() {
        return  this.nPage;
      },
      setPage: function(page) {
        this.nPage = page;
        if( this.nPage < 0 ) {
          this.nPage = 0;
        }
        if( this.nPage >= this.getPageCount() ) {
          this.nPage = this.getPageCount() - 1;
        }
      }
  };
  Funds.prototype = Object.assign(Funds.prototype, pageFuntions);
  Investors.prototype = Object.assign(Investors.prototype, pageFuntions);

  // prototype에 직접 연결하는 방법
  // Investors.prototype.getPageCount = Funds.prototype.getPageCount = function() {
  //   return Math.floor((this.getCount() + this.divide - 1) / this.divide);
  // };
  // Investors.prototype.getPage = Funds.prototype.getPage = function() {
  //   return  this.nPage;
  // };
  // Investors.prototype.setPage = Funds.prototype.setPage = function(page) {
  //   this.nPage = page;
  //   if( this.nPage < 0 ) {
  //     this.nPage = 0;
  //   }
  //   if( this.nPage >= this.getPageCount() ) {
  //     this.nPage = this.getPageCount() - 1;
  //   }
  // };
}

window.onload = function () {
  injectPaginationToClass();

  $.ajaxSetup({async: false});
  $('input').attr('maxlength', 100);
  $('textarea').attr('maxlength', 500);

  let pages = ['mainScreen', 'view', 'Register', 'investor', 'login', 'signUp'];

  let navATag = $(".nav-lists-a");
  navATag.on("click", function (e) {
    pages.forEach((sectionName, i) => {
      if (this.innerText == navATag[i].innerText) {
        $(navATag[i]).addClass("active");
        $(`.${sectionName}`).addClass("activity");
        refreshFundBox($(`.${sectionName}`));
        // console.log('FIND', this.innerText, navATag[i].innerText);
      }
      else {
        $(navATag[i]).removeClass("active");
        $(`.${sectionName}`).removeClass("activity");
        // console.log('Not found:', this.innerText, navATag[i].innerText);
      }
    });
  });

  $(window).on("scroll", function (e) {
    let nowWTop = parseInt($(window).scrollTop());
    // let nowWHeight = parseInt($(window).height());
    // console.log(nowWTop, nowWHeight);
    if (nowWTop >= 1 ) {
      $("#header-top").css({height: "0px"});
      $("#header").css({backgroundColor: "rgba(1,1,1,0)"});
      $("#header-bottom-wrap").css({backgroundColor: "#fff"});
      $("#logo").css({color: "#333"});
      $(".nav-lists-a").css({color: "#333"});
      $(".headBtnStyle").css({color: "#333"});
    }

    if (nowWTop <= 0) {
      $("#header-top").css({height: "44px"});
      $("#header-bottom").css({backgroundColor: "rgba(1,1,1,0)", color: "#fff"});
      $("#header-bottom-wrap").css({backgroundColor: "rgba(1,1,1,0)"});
      $("#logo").css({color: "#fff"});
      $(".nav-lists-a").css({color: "#fff"});
      $(".headBtnStyle").css({color: "#fff"});
    }
  });

  let tmNextWeek = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);

  let addFundInp = $(".form-group .form-control");
  addFundInp[0].value = randomNumber();
  addFundInp[2].value = new Date(tmNextWeek).toISOString().substr(0, 19);

  addFundInp.on('change', e => {
    addFundInp.each((idx) => $(this).css({border: "1px solid #ccc"}));

    if (new Date(addFundInp[2].value).getTime() <= new Date().getTime()) {
      showAlert("지난 날짜는 추가할 수 없습니다.");
      $(addFundInp[2]).css({border: "2px solid #e7212a"});
    }
    // maxLength를 500으로 지정해서 입력이 불가능함. (체크할 필요없음)
    // if (addFundInp[4].value.length > 500) {
    //   showAlert("500자를 초과할 수 없습니다.");
    //   $(addFundInp[4]).css({border: "2px solid #e7212a"});
    // }
  });

  $("#addFundBtn").on("click", function () {
    let bInputIsNull = false;
    [1, 2, 3, 4].forEach(idx => {
      if (!addFundInp[idx].value) {
        $(addFundInp[idx]).css({border: "2px solid #e7212a"});
        bInputIsNull = true;
      }
    });
    if( bInputIsNull ) {
      showAlert("값이 비었습니다.");
    }
    else if (new Date(addFundInp[2].value).getTime() <= new Date().getTime()) {
      showAlert("지난 날짜는 추가할 수 없습니다.");
      $(addFundInp[2]).css({border: "2px solid #e7212a"});
    }
    // maxLength를 500으로 지정해서 입력이 불가능함. (체크할 필요없음)
    // else if (addFundInp[4].value.length > 500) {
    // }
    else {
      g_Funds.putFund({
        number: addFundInp[0].value,
        name: addFundInp[1].value,
        enddate: addFundInp[2].value.replace("T", " "),
        total: parseInt(addFundInp[3].value),
        memo: parseInt(addFundInp[4].value),
        image: $('.regDiv1st > img').attr('src')
      });

      showAlert(`'${addFundInp[1].value}' 펀드가 추가 되었습니다.`);
      gotoSectionPage('View');
    }
  });

  let user = g_User.getUser();
  console.log(user);
  if (user) {
    putUserName(user.name, 0);
    navATag[0].click();
  }
  else {
    putUserName('', 1);
    navATag[4].click();
  }
  initSignCanvas($('#pageContents > canvas')[0]);
};
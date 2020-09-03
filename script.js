// g_FundArr = [];
g_nFundViewPage = 0;
g_nInvestorPage = 0;

Number.prototype.toCurrency = function () {
  return Number(this.valueOf()).toLocaleString('kr', 'currency');
};

function showAlert(msg) {

  let toastContainer = document.querySelector("#toastList");
  let div = document.createElement("div");
  div.classList.add("toast");

  let template = `<p class="msg">${msg}</p><span class="close">&times;</span>`;
  div.innerHTML = template;
  let closeTimer = setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => { toastContainer.removeChild(div); }, 700);
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

function signInCanvas() {
  console.log("들어옴")
  let canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");

  let pos = { drawable: false, x: -1, y: -1};

  canvas.addEventListener("mouseup" , listener());
  canvas.addEventListener("mousedown" , listener());
  canvas.addEventListener("mousemove" , listener());
  canvas.addEventListener("mouseout" , listener());
}

function listener() {
  switch(envent.type) {
    case "mousedown" :
      ctx.beginPath();
      pos.drawable = true;
      // let coors = getPosition(event);
      pos.X = coors.X;
      pos.Y = coors.Y;
      ctx.moveTo(pos.X, pos.Y);
      break;
    case "mouseup" :
      // let coors = getPosition(event);
      ctx.lineTo(pos.X, pos.Y);
      pos.X = coors.X;
      pos.Y = coors.Y;
      ctx.stroke();
      break;
    case "mouseout" :
      pos.drawable = false;
      pos.X = -1;
      pos.Y = -1;
      break;
    case "mousemove" :
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageX - canvas.offsetTop;
      break;
  }
}

function investFund() {
  let inputs = $("#pageContents").find("input");
  let fund = g_Funds.getFund(inputs[0].value);
  let investMoney = parseInt(inputs[3].value);
  let success = g_Investors.putInvestor({
    number: fund.number,
    email: g_User.user.email,
    name: fund.name,
    sign: null,
    total: fund.total,
    money: investMoney
  });
  if( success ) {
    g_Funds.putFund({
      number: fund.number,
      current: (fund.current + investMoney)
    });
  }
  OffInvestPage();
  $(".nav-lists-a")[1].click();
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
  };


  return text1 + text2;
}

function selectFundImage() {
  $("#fundImage").on("change", e=>{
    if(e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = res => {
        $('.regDiv1st > img').attr('src', res.target.result);
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  $("#fundImage").click();
}

function OffDetailView() {
  let detailView = $("#detailView");

  detailView.css({
    left: "-200%"
  });
}

function OffInvestPage() {
  let investPage = $("#investPage");

  investPage.css({
    left: "-200%"
  });
}
function offProFile() {
  let profile = $("#profile");

  profile.css({
    left: "-200%"
  });
}

function GoToAddFund() {
  let navATag = $(".nav-lists-a");

  navATag[2].click();
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
  $(".nav-lists-a")[4].click();
}

function goToSignUp() {
  $(".nav-lists-a")[5].click();
}

function userInfo() {
  $("#profile").css({ left: "0" });
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

    } else if (btnText == 'invested') {
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
    } else if (btnText == 'completed') {
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
  $(".nav-lists-a")[3].click();
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
      $(".nav-lists-a")[0].click();
    } else {
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
    $(navATags[4]).css({
      display: "none"
    });
    $(navATags[5]).css({
      display: "none"
    });
    $(".user-name").css({
      display: "block"
    });
    $(".logout").css({
      display: "block"
    });
  } else {
    $(navATags[4]).css({
      display: "list-item"
    });
    $(navATags[5]).css({
      display: "list-item"
    });
    $(".user-name").css({
      display: "none"
    });
    $(".logout").css({
      display: "none"
    });
  }
};

function signUpUser() {
  let inputs = $("#lRightText2 > .loginInputs");

  console.log(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value);
  fetch(`php/create_user.php?email=${inputs[0].value}&name=${inputs[1].value}&pwd=${inputs[2].value}`).then(value => value.json()).then(JsonValue => {
    if (JsonValue.result == 1) {
      showAlert(`등록되었습니다.`);
      let navATag = $(".nav-lists-a");
      navATag[4].click();
    } else {
      showAlert("형식에 맞지 않습니다.");
    }
  })
}

function logOut() {

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
    investorList.append(`<div>${value.uname}, ${value.money}</div>`);
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

function makeViewPagination(fundBox) {
  let nPage = fundBox.hasClass('view') ? g_nFundViewPage : g_nInvestorPage;
  let nCount = fundBox.hasClass('view') ? g_Funds.getFundCount() : g_Investors.getInvestorCount();
  let maxPage = Math.ceil(nCount / 10.0);
  let pageHtml = `<div class="${nPage === 0 ? 'disable' : 'normal'}">＜</div>`;
  for (let i = 0; i < maxPage; i++) {
    pageHtml += `<div class="${nPage === i ? 'active-ball' : 'normal'}">${i + 1}</div>`;
  }
  pageHtml += `<div class="${nPage === (maxPage-1) ? 'disable' : 'normal'}">＞</div>`;

  fundBox.find('.pagination').html(pageHtml);

  fundBox.find('.pagination > div').on('click', (e) => {
    if ($(e.target).hasClass('disable')) return;
    let value = $(e.target).html();
    if (value === '＜') {
      nPage--;
    }
    else if (value === '＞') {
      nPage++;
    }
    else {
      nPage = Number(value) - 1;
    }
    $(".nav-lists-a")[1].click();
  });
}

function refreshFundBox(fundBox) {

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
  } else if (fundBox.hasClass('view')) {

    makeViewPagination(fundBox);

    let fundList1 = document.querySelector(".fundList1");
    $(fundList1).empty();
    g_Funds.getFunds(g_nFundViewPage).forEach(value => {

      let divTag = document.createElement('div');
      divTag.innerHTML = `<div id="viewFund${value.number}" class="viewListWrapper">
                            <div class="graph">
                              <div class="graph-bar"></div>
                            </div>
                            <div class="form-control1 text-sz1-b" style="
                            font-weight: bold;
                        ">${value.number}</div>
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
          $("#investPage").css({
            left: "0%"
          });


          inputs[0].value = number;
          inputs[1].value = g_Funds.getFund(number).name;
          inputs[2].value = g_User.getUser().name;
          // document.querySelector("#canvas") = signInCanvas();
        } else {
          // console.log("c");
          detailPopup(e);
        }
      });
    });

  } else if (fundBox.hasClass('Register')) {
    let addFundInp = document.querySelectorAll(".form-group .form-control");
    addFundInp.forEach(element => {
      element.value = "";
    })
    addFundInp[0].value = randomNumber();
  } else if (fundBox.hasClass('investor')) {
    makeViewPagination(fundBox);
    let investBody = $("#investorInfos");
    investBody.empty();
    g_Investors.getInvestors(g_nInvestorPage).forEach(value => {
      investBody.append(`<tr>
      <td width="100px">${value.number}</td>
      <td width="40%">${value.fname}</td>
      <td width="130px">${value.uname}</td>
      <td width="100px">${value.money}</td>
      <td width="250px">${value.percent}%</td>
      <td width="100px"><button class="buttonStyle">download</button></td>
      </tr>`);
    })
    investBody.find("button").on("click", e => {
      // $(e.target).parent().parent().firstChild
      showAlert("다운로드 완료");
    })
  }
}

function getJsonFund(callBack) {
  $.getJSON("fund.json").done(jsValue => {
    // console.log(JsonValue);

    callBack(jsValue);
  })
}

window.onload = function () {
  $.ajaxSetup({
    async: false
  });
  let navATag = $(".nav-lists-a");

  pages = ['mainScreen', 'view', 'Register', 'investor', 'login', 'signUp'];

  navATag.on("click", function (e) {
    pages.forEach((sectionName, i) => {
      if (this.innerText == navATag[i].innerText) {
        $(navATag[i]).addClass("active");
        $(`.${sectionName}`).addClass("activity");
        refreshFundBox($(`.${sectionName}`));
        // console.log('FIND', this.innerText, navATag[i].innerText);

      } else {
        $(navATag[i]).removeClass("active");
        $(`.${sectionName}`).removeClass("activity");
        // console.log('Not found:', this.innerText, navATag[i].innerText);

      }
    });
  });

  $(window).on("scroll", function (e) {
    let nowWTop = parseInt($(window).scrollTop());
    let nowWHeight = parseInt($(window).height());
    // console.log(nowWTop, nowWHeight)
    if (nowWTop >= 1) {
      $("#header-top").css({
        height: "0px"
      });
      $("#header").css({
        backgroundColor: "rgba(1,1,1,0)"
      });
      $("#header-bottom-wrap").css({
        backgroundColor: "#fff"
      });
      $("#logo").css({
        color: "#333"
      });
      $(".nav-lists-a").css({
        color: "#333"
      });
      $(".headBtnStyle").css({
        color: "#333"
      });
    }

    if (nowWTop <= 0) {
      $("#header-top").css({
        height: "44px"
      });
      $("#header-bottom").css({
        backgroundColor: "rgba(1,1,1,0)",
        color: "#fff"
      });
      $("#header-bottom-wrap").css({
        backgroundColor: "rgba(1,1,1,0)"
      });
      $("#logo").css({
        color: "#fff"
      });
      $(".nav-lists-a").css({
        color: "#fff"
      });
      $(".headBtnStyle").css({
        color: "#fff"
      });
    }
  });

  let addFundInp = document.querySelectorAll(".form-group .form-control");
  addFundInp[0].value = randomNumber();

  $(addFundInp).keyup(function (e)  {
    addFundInp.forEach(value => {
      $(value).css({border:"1px solid #ccc"});
    })

    if (new Date(addFundInp[2].value).getTime() <= new Date().getTime()) {
      showAlert("지난 날짜는 추가할 수 없습니다.");
      $(addFundInp[2]).css({border:"2px solid #e7212a"});
    }

    if(addFundInp[4].value.length > 500) {
      showAlert("500자를 초과할 수 없습니다.");
      $(addFundInp[4]).css({border:"2px solid #e7212a"});
    }
  });

  $("#addFundBtn").on("click", function () {
    if (addFundInp[1].value == "" || addFundInp[2].value == "" || addFundInp[3].value == "" || addFundInp[4].value == "") {
      showAlert("값이 비었습니다.")
      $(addFundInp[1]).css({border:"2px solid #e7212a"});
      $(addFundInp[2]).css({border:"2px solid #e7212a"});
      $(addFundInp[3]).css({border:"2px solid #e7212a"});
      $(addFundInp[4]).css({border:"2px solid #e7212a"});
    } else if(new Date(addFundInp[2].value).getTime() <= new Date().getTime()) {
      showAlert("지난 날짜는 추가할 수 없습니다.");
      $(addFundInp[2]).css({border:"2px solid #e7212a"});
    } else if(addFundInp[4].value.length > 500) {

    } else {
      g_Funds.putFund( {
      number: addFundInp[0].value,
      name: addFundInp[1].value,
      enddate: addFundInp[2].value.replace("T", " "),
      total: parseInt(addFundInp[3].value),
      memo: parseInt(addFundInp[4].value),
      image: $('.regDiv1st > img').attr('src')
      });

      showAlert("추가 됐습니다.");
      $(".nav-lists-a")[1].click();
      console.log(addFundInp[2].value);
    }
  })

  let user = g_User.getUser();
  console.log(user);
  if (user) {
    putUserName(user.name, 0);
    navATag[0].click();
  } else {
    putUserName('', 1);
    navATag[4].click();
  }


}
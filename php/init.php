<?php
  require("db.php");

  header('Content-Type: application/json');

  $sql1 = "create table if not exists fund (
      number varchar(20) not null,
      name varchar(100),
      enddate datetime,
      total int(11) not null,
      current int(11) not null,
      percent int(11) not null,
      image mediumtext,
      createtm datetime default current_timestamp,
      primary key (number)
    ) engine=innodb default charset=utf8";
  execSql($con, $sql1);

  $sql2 = "create table if not exists investor (
     number varchar(20) not null,
     email varchar(100) not null,
     name varchar(100),
     total int(11) not null,
     money int(11) not null,
     sign mediumtext,
     investtm datetime default current_timestamp,
     primary key (number,email)
   ) engine=innodb default charset=utf8;";
  execSql($con, $sql2);

  $sql3 = "create table  if not exists user (
      email varchar(100) not null,
      name varchar(100) not null,
      pwd varchar(100) not null,
      money int(11) default 50000,
      primary key (email)
    ) engine=innodb default charset=utf8";
  execSql($con, $sql3);

  // 기본 데이터 입력
  $insQry1  = "insert into user (email, name, pwd, money) values ";
  $insQry1 .= "  ('admin', '관리자', password('1234'), 0),";
  $insQry1 .= "  ('ny030303@naver.com', '정나영', password('1234'), 50000)";
  execSql($con, $insQry1);

  $insQry2  = "insert into test.fund (number, name, enddate, total, current, percent, image, createtm) values ";
  $insQry2 .= "  ('A0123', '대한민국 1등 비건 베이커리', '2019-06-20 15:30:00', '40000', '36000', '90', NULL, now()), ";
  $insQry2 .= "  ('A0495', '환경 친화적인 비닐개발', '2019-08-24 17:00:30', '100000', '5000', '5', NULL, now()), ";
  $insQry2 .= "  ('A1001', '기능반 간식비 프로젝트', '2019-08-30 09:00:00', '100000', '9500', '10', NULL, now()), ";
  $insQry2 .= "  ('A7184', '돈안내고 스팀 게임하기', '2019-08-04 17:00:30', '50000', '20000', '40', NULL, now()), ";
  $insQry2 .= "  ('B0123', '2mm 열선을 세상을 따뜻하게 껴안을', '2019-06-20 15:30:00', '40000', '35000', '88', NULL, now()), ";
  $insQry2 .= "  ('B0495', '캐럿게임즈의 두번째 MMORPG', '2019-08-24 17:00:30', '100000', '5000', '5', NULL, now()), ";
  $insQry2 .= "  ('B0496', '자바 공부 교재 개발하기', '2020-02-19 08:30:00', '200000', '0', '0', NULL, now()), ";
  $insQry2 .= "  ('B0497', '글로벌 크래프트 맥주회사', '2019-08-30 09:00:00', '300000', '500', '0', NULL, now()), ";
  $insQry2 .= "  ('B7184', '세계최초 벽화 로봇, ROBOPRINT', '2019-08-04 17:00:30', '90000', '20000', '22', NULL, now()), ";
  $insQry2 .= "  ('C0123', '물품 보관에 관한 토탈솔루션', '2019-06-20 15:30:00', '40000', '35000', '88', NULL, now()), ";
  $insQry2 .= "  ('C0495', '페인트로 세상을 바꾸는 기업', '2019-08-24 17:00:30', '100000', '5000', '5', NULL, now()), ";
  $insQry2 .= "  ('C0496', '보드마카 탄생이후 최대의 혁신!', '2020-02-19 08:30:00', '200000', '0', '0', NULL, now()), ";
  $insQry2 .= "  ('C0498', '구원의 그림자, 모바일 MMORPG', '2019-08-30 09:00:00', '100000', '500', '1', NULL, now()), ";
  $insQry2 .= "  ('C7184', '교육용, 의료용 3D 프린터 시장의 강자', '2019-08-04 17:00:30', '100000', '20000', '20', NULL, now()), ";
  $insQry2 .= "  ('D0123', '3D프린터 소재의 혁신! 고강도 신소재', '2019-06-20 15:30:00', '40000', '35000', '88', NULL, now()), ";
  $insQry2 .= "  ('D0495', '피부로 느끼는 보급형 인공지능, 아스크스토리', '2019-08-24 17:00:30', '100000', '5000', '5', NULL, now()), ";
  $insQry2 .= "  ('D0496', '국가대표도 사용하는 스포매틱스', '2020-02-19 08:30:00', '15000', '0', '0', NULL, now()), ";
  $insQry2 .= "  ('D0498', '지식과 정보를 알기쉽게 알려주는 교양채널', '2019-08-30 09:00:00', '100000', '500', '1', NULL, now()), ";
  $insQry2 .= "  ('D7184', '유리창에 바르는 특수페인트', '2019-08-04 17:00:30', '58000', '20000', '34', NULL, now()), ";
  $insQry2 .= "  ('E0123', '모든 매장에 적용하는 스마트오더', '2019-06-20 15:30:00', '40000', '35000', '88', NULL, now()), ";
  $insQry2 .= "  ('E0495', '국내 유일 고급 모자 브랜드', '2019-08-24 17:00:30', '100000', '5000', '5', NULL, now()), ";
  $insQry2 .= "  ('E0498', '교사집단지성 교육공유', '2020-02-19 08:30:00', '200000', '0', '0', NULL, now()), ";
  $insQry2 .= "  ('E0499', '직장인 온/오프라인 직무교육', '2019-08-30 09:00:00', '100000', '500', '1', NULL, now()), ";
  $insQry2 .= "  ('E7184', '데이터 기반, 최저가 신차 구매', '2019-08-04 17:00:30', '50000', '20000', '40', NULL, now()) ";
  execSql($con, $insQry2);

  $insQry3  = "insert into test.investor (number, email, name, total, money, sign, investtm) values ";
  $insQry3 .= " ('A0123', 'admin', '대한민국 1등 비건 베이커리', '40000', '35000', NULL, now()), ";
  $insQry3 .= " ('A0123', 'ny030303@naver.com', '대한민국 1등 비건 베이커리', '40000', '1000', NULL, now()), ";
  $insQry3 .= " ('A0495', 'admin', '환경 친화적인 비닐개발', '100000', '5000', NULL, now()), ";
  $insQry3 .= " ('A1001', 'admin', '기능반 간식비 프로젝트', '100000', '500', NULL, now()), ";
  $insQry3 .= " ('A1001', 'ny030303@naver.com', '기능반 간식비 프로젝트', '100000', '9000', NULL, now()), ";
  $insQry3 .= " ('A7184', 'ny030303@naver.com', '돈안내고 스팀 게임하기', '50000', '20000', NULL, now()), ";
  $insQry3 .= " ('B0123', 'ny030303@naver.com', '2mm 열선을 세상을 따뜻하게 껴안을', '40000', '35000', NULL, now()), ";
  $insQry3 .= " ('B0495', 'ny030303@naver.com', '캐럿게임즈의 두번째 MMORPG', '100000', '5000', NULL, now()), ";
  $insQry3 .= " ('B0496', 'ny030303@naver.com', '자바 공부 교재 개발하기', '200000', '0', NULL, now()), ";
  $insQry3 .= " ('B0497', 'ny030303@naver.com', '글로벌 크래프트 맥주회사', '300000', '500', NULL, now()), ";
  $insQry3 .= " ('B7184', 'admin', '세계최초 벽화 로봇, ROBOPRINT', '50000', '20000', NULL, now()), ";
  $insQry3 .= " ('C0123', 'admin', '물품 보관에 관한 토탈솔루션', '40000', '35000', NULL, now()), ";
  $insQry3 .= " ('C0495', 'ny030303@naver.com', '페인트로 세상을 바꾸는 기업', '100000', '5000', NULL, now()), ";
  $insQry3 .= " ('C0496', 'admin', '보드마카 탄생이후 최대의 혁신!', '200000', '0', NULL, now()), ";
  $insQry3 .= " ('C0498', 'admin', '구원의 그림자, 모바일 MMORPG', '100000', '500', NULL, now()), ";
  $insQry3 .= " ('C7184', 'admin', '교육용, 의료용 3D 프린터 시장의 강자', '50000', '20000', NULL, now()), ";
  $insQry3 .= " ('D0123', 'ny030303@naver.com', '3D프린터 소재의 혁신! 고강도 신소재', '40000', '35000', NULL, now()), ";
  $insQry3 .= " ('D0495', 'admin', '피부로 느끼는 보급형 인공지능, 아스크스토리', '100000', '5000', NULL, now()), ";
  $insQry3 .= " ('D0496', 'admin', '국가대표도 사용하는 스포매틱스', '15000', '0', NULL, now()), ";
  $insQry3 .= " ('D0498', 'admin', '지식과 정보를 알기쉽게 알려주는 교양채널', '100000', '500', NULL, now()), ";
  $insQry3 .= " ('D7184', 'admin', '유리창에 바르는 특수페인트', '50000', '20000', NULL, now()), ";
  $insQry3 .= " ('E0123', 'admin', '모든 매장에 적용하는 스마트오더', '40000', '35000', NULL, now()), ";
  $insQry3 .= " ('E0495', 'ny030303@naver.com', '국내 유일 고급 모자 브랜드', '100000', '5000', NULL, now()), ";
  $insQry3 .= " ('E0498', 'admin', '교사집단지성 교육공유', '200000', '0', NULL, now()), ";
  $insQry3 .= " ('E0499', 'ny030303@naver.com', '직장인 온/오프라인 직무교육', '100000', '500', NULL, now()), ";
  $insQry3 .= " ('E7184', 'admin', '데이터 기반, 최저가 신차 구매', '50000', '20000', NULL, now()) ";
  execSql($con, $insQry3);

  $json = json_encode(array('result' => 1, 'msg' => 'success.'));
  echo $json;

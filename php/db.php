<?php
  session_start();
  $dsn = "mysql:host=localhost;dbname=test;charset=utf8";
  $con = new PDO($dsn, "root");

  function fetch($con, $sql, $params = []) {
    $p = $con->prepare($sql);
    $p->execute($params);
    return $p->fetchAll(PDO::FETCH_OBJ); //FETCH_OBJ
  }

  function execSql($con, $sql, $params = []) {
    $p = $con->prepare($sql);
    if( $p->execute($params) ) return 1;
    else return 0;
  }

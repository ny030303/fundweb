<?php
  session_start();
$dsn = "mysql:host=gondr.asuscomm.com;dbname=yy_10107;charset=utf8mb4";

$con = new PDO($dsn, "yy_10107", 'jj7323751');

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

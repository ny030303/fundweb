<?php

  header('Content-Type: application/json');

  require("db.php");

  $number = isset($_GET["number"]) ? $_GET["number"] : 'none';
  $query = "SELECT a.number, a.name,  b.name as uname, a.total, a.money, a.sign
     FROM test.investor as a 
     inner join test.user as b 
     on a.email = b.email where number = ? ";
  $investor = fetch($con, $query , [$number]);
  if($investor) {
    echo json_encode(array("result"=>1, "datas"=>$investor));
  } else {
    echo json_encode(array("result"=>0));
  }
?>
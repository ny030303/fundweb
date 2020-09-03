<?php

  header('Content-Type: application/json');

  require("db.php");

  $email = isset($_GET["email"]) ? $_GET["email"] : 'none';
  $query = "select * from fundweb_investor where email = ? ";
  $investor = fetch($con, $query , [$email]);
  if($investor) {
    echo json_encode(array("result"=>1, "datas"=>$investor));
  } else {
    echo json_encode(array("result"=>0));
  }
?>
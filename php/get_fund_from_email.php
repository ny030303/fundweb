<?php

  header('Content-Type: application/json');

  require("db.php");

  // $email = $_GET["email"];
  // $pwd = $_GET["pwd"];

  $email = isset($_GET['email']) ? $_GET['email'] : null;

  $query = "select * from fund where creator = ?";

  $fund = fetch($con, $query , [$email]);

  if($fund) {
    echo json_encode(array("result"=>1, "datas"=>$fund));
  } else {
    echo json_encode(array("result"=>0));
  }
?>
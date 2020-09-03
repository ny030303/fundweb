<?php

  header('Content-Type: application/json');

  require("db.php");

  // $email = $_GET["email"];
  // $pwd = $_GET["pwd"];

  $number = isset($_GET['number']) ? $_GET['number'] : null;

  $query = "select * from fundweb_fund where number = ?";

  $fund = fetch($con, $query , [$number]);

  if($fund) {
    echo json_encode(array("result"=>1, "fund"=>$fund));
  } else {
    echo json_encode(array("result"=>0));
  }
?>
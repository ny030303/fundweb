<?php

  header('Content-Type: application/json');

  require("db.php");

  $email = isset($_GET["email"]) ? $_GET["email"] : 'none';
  $query = "select * from test.user where email = ?";
  $user = fetch($con, $query , [$email]);
  if($user) {
    echo json_encode(array("result"=>1, "user"=>$user[0]));
  } else {
    echo json_encode(array("result"=>0));
  }
?>
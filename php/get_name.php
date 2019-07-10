<?php

  header('Content-Type: application/json');

  require("db.php");

  $email = isset($_GET["email"]) ? $_GET["email"] : null;
  $query = "select name from user where email = ?";

  $user = fetch($con, $query , [$email]);
  if($user) {
    echo json_encode(array("result"=>1, "name"=>$user[0]->name));
  } else {
    echo json_encode(array("result"=>0));
  }
?>
<?php

  header('Content-Type: application/json');

  require("db.php");


  $email = isset($_GET["email"]) ? $_GET["email"] : null;
  $pwd = isset($_GET["pwd"]) ? $_GET["pwd"] : null;

  if ($email == null or $pwd == null) {
    if( isset($_SESSION["loginUser"]) ) {
      echo json_encode(array("result"=>1, "user"=>$_SESSION["loginUser"]));
    } else {
      echo json_encode(array("result"=>0));
    }

  } else {
    $query = "select * from user where email = ? and pwd = password(?)";

    $user = fetch($con, $query , [$email, $pwd]);
    if($user) { // 로그인 성공
      $_SESSION["loginUser"]  = $user[0];
      echo json_encode(array("result"=>1, "user"=>$user[0]));
    } else {
      echo json_encode(array("result"=>0));
    }
  }
  
?>
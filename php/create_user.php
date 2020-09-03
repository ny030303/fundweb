<?php

  header('Content-Type: application/json');

  require("db.php");

  $email = $_GET["email"];
  $pwd = $_GET["pwd"];
  $name = $_GET["name"];

  $query = "INSERT INTO `fundweb_user`(`email`, `pwd`, `name`, `money`) VALUES (?,password(?),?,50000)";

  $bInserted = insertDb($con, $query , [$email, $pwd, $name]);  
  echo json_encode(array("result"=>$bInserted));
  
?>
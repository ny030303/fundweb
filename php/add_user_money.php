<?php
    require("db.php");

    header('Content-Type: application/json');

    $email  = $_POST['email'];
    $money = $_POST['money'];

    $sql  = "update user set money = (money + ?) where email = ?";
    if( execSql($con, $sql, [$money, $email]) ) {
        echo json_encode(array('result' => 1));
    }
    else {
        echo json_encode(array('result' => 0));
    }
?>

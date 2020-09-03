<?php
    require("db.php");

    header('Content-Type: application/json');

    $email  = $_POST['email'];
    $number = $_POST['number'];
    $name   = isset($_POST['name'])  ? $_POST['name']    : null;
    $total  = (int) $_POST['total'];
    $money  = isset($_POST['money']) ? (int) $_POST['money'] : 0;
    $sign   = isset($_POST['sign'])  ? $_POST['sign']   : null;

    $params = [ $number, $email, $name, $total, $money, $sign ];

    $sql  = "insert into fundweb_investor (number, email, name, total, money, sign) values (?, ?, ?, ?, ?, ?) ";
    $sql .= " on duplicate key update ";
    if( $name  != null ) $sql .= "   name = values(name), ";
    if( $total != null ) $sql .= "   total = values(total), ";
    if( $money != null ) $sql .= "   money = values(money), ";
    if( $sign  != null ) $sql .= "   sign = values(sign), ";
    $sql .= "   investtm = now() ";

    if( execSql($con, $sql, $params) ) {
        echo json_encode(array('result' => 1));
    }
    else {
        echo json_encode(array('result' => 0));
    }
?>

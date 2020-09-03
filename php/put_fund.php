<?php
    require("db.php");

    header('Content-Type: application/json');

    $number  = $_POST['number'];
    $name    = isset($_POST['name'])    ? $_POST['name']    : null;
    $enddate = isset($_POST['enddate']) ? $_POST['enddate'] : null;
    $total   = (int) $_POST['total'];
    $current = isset($_POST['current']) ? (int) $_POST['current'] : 0;
    $image   = isset($_POST['image'])   ? $_POST['image']   : null;
    $memo   =  isset($_POST['memo']) ? $_POST['memo'] : null;
    $creator   =  $_SESSION['loginUser']->email;
    $sql = "";
    $params = array();
    
    if( ($name != null) and ($enddate != null) ) {
        $sql  = "insert into fundweb_fund (number, name, enddate, total, current, percent, image, memo, creator) ";
        $sql .= "  values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [$number, $name, $enddate, $total, 0, 0, $image, $memo, $creator];
    }
    else {
        $sql = "update fundweb_fund set ";
        if( $current != null)  {
            $sql .= " current = ?, percent = ?";
            array_push($params, $current);
            array_push($params, $current * 100 / $total);
        }
        if( $image != null)  {
            if( count($params) > 0 ) $sql .= ",";
            $sql .= " image = ? ";
            array_push($params, $image);
        }
        $sql .= "  where number = ? ";
        array_push($params, $number);
    }
    if( execSql($con, $sql, $params)) {
        echo json_encode(array('result' => 1));
    }
    else {
        echo json_encode(array('result' => 0));
    }
?>
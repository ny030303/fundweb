<?php
    require("db.php");

    header('Content-Type: application/json');

    $sql  = "select * from test.fund ";
    $sql .= "where (enddate > now()) and (total > current) order by percent desc limit 4";
    $funds = fetch($con, $sql);
    if($funds) {
      echo json_encode(array("result"=>1, 'datas' => $funds));
    } else {
      echo json_encode(array("result"=>0));
    }
?>
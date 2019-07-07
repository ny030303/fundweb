<?php
    require("db.php");

    header('Content-Type: application/json');

    $page = isset($_GET['page']) ? ((int) $_GET['page']) * 10 : 0;

    $sql = "select * from test.fund order by createtm desc limit {$page}, 10";
    $funds = fetch($con, $sql);
    if(!$funds){
         $json = json_encode(array('result' => 0));
         echo $json;
         exit;
    }
    $json = json_encode(array('result' => 1, 'datas' => $funds));
    echo $json;
?>
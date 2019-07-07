<?php
    require("db.php");

    header('Content-Type: application/json');

    $page = isset($_GET['page']) ? ((int) $_GET['page'] * 10) : 0;
    
    ;

    // $sql = "select * from test.investor order by investtm desc limit {$page}, 10";
     $sql = "SELECT a.number, a.name,  b.name as uname, a.total, a.money, a.sign
     FROM test.investor as a 
     inner join test.user as b 
     on a.email = b.email 
     order by investtm desc limit {$page}, 10";
    $investors = fetch($con, $sql);
    if(!$investors){
         $json = json_encode(array('result' => 0));
         echo $json;
         exit;
    }
    $json = json_encode(array('result' => 1, 'datas' => $investors));
    echo $json;
?>
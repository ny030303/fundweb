<?php
    require("db.php");

    header('Content-Type: application/json');

    $fund = fetch($con, "select count(*) count from test.fund");
    // $investor = fetch($con, "select count(*) count from test.investor");
    // $user = fetch($con, "select count(*) count from test.user");

    $json = json_encode(array(
        "result" => 1,
        "fund" => (int) $fund[0]->count,
        // "investor" => (int) $investor[0]->count,
        // "user" => (int) $user[0]->count
    ));
    echo $json;
?>
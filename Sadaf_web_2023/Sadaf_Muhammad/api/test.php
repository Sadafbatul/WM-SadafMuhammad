<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

define ('INDEX', true);

require 'inc/dbcon.php';
require 'inc/base.php';

$stmt = $conn->prepare("SELECT * FROM vak"); 

if (!$stmt){

    $response['code'] = 7;
    $response['status'] = 200; // 'ok' status, anders een bad request ...
    $response['data'] = $conn->error;
    deliver_response($response);
}

// bind parameters
// s staat voor string
// i staat voor integer
// d staat voor double
// b staat voor blob
// "ss" staat dus voor String, String


if (!$stmt->execute()) {
    $response['code'] = 7;
    $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
    $response['data'] = $conn->error;
    deliver_response($response);
}

$result = $stmt->get_result();

if (!$result) {

    $response['code'] = 7;
    $response['status'] = $api_response_code[$response['code']]['HTTP Response'];
    $response['data'] = $conn->error;
    deliver_response($response);
}

$response['data'] = getJsonObjFromResult($result); // -> fetch_all(MYSQLI_ASSOC)

$result->free();

$conn->close();

deliver_JSONresponse($response);
?>
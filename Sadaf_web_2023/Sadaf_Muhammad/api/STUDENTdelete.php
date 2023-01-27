<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

define ('INDEX', true);
require 'inc/dbcon.php';
require 'inc/base.php';


if(!$stmt = $conn->prepare("DELETE FROM student WHERE studentennummer = ? AND vak_code = ?;")){
    die('{"error":"Prepared Statement failed on prepare","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
}

// bind parameters
// s staat voor string
// i staat voor integer
// d staat voor double
// b staat voor blob
// "sid" staat dus voor string, integer, double
if(!$stmt -> bind_param("ss", htmlentities($postvars['studentennummer']), $postvars['vak_code'])){
    die('{"error":"Prepared Statement bind failed on bind","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
}
$stmt -> execute();

if($conn->affected_rows == 0) {

    $stmt -> close();
    echo "FOUT";
    die('{"error":"Prepared Statement failed on execute : no rows affected","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
}


$stmt -> close();

die('{"data":"ok","message":"Record added successfully","status":"ok"}');

?>
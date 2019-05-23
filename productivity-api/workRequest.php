<?php
include_once "lib/init.php";

include_once $ROOTPATH."/includes/class.workRequest.php";

// error_reporting(E_ALL);
// ini_set("display_errors",1);

$requestObj = new WORKREQUESTS();
 $json = file_get_contents('php://input');
 $obj = json_decode($json, true);
//  $obj = $_POST;
//  pr($obj);exit;
if($obj["requestCode"] === 14){
    $response = $requestObj->createWorkRequest($obj);
}
elseif($obj["requestCode"] === 15){
    $response = $requestObj->getWorkRequestList($obj);
}
elseif($obj["requestCode"] === 16){
    $response = $requestObj->getWorkRequestDetails($obj);
}

echo $response;

 ?>
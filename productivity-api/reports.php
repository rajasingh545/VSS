<?php
include_once "lib/init.php";

include_once $ROOTPATH."/includes/class.report.php";

// error_reporting(E_ALL);
// ini_set("display_errors",1);

$requestObj = new REPORTS();
 $json = file_get_contents('php://input');
 $obj = json_decode($json, true);
 if($obj["requestCode"] === 2){ //categorywise report
    $response = $requestObj->getCurrentBalance($obj["materialName"], $obj["subCategorySel"]);
 }
 if($obj["requestCode"] === 3){ //projectwise report
    $response = $requestObj->getProjectReport($obj["projects"]);
 }
 if($obj["requestCode"] === 4){ //notification search
    $response = $requestObj->notificationSearch($obj);
 }

echo $response;

?>
<?php
include_once "lib/init.php";

include_once $ROOTPATH."/includes/class.commonAPI.php";

$apiObj = new commonAPI();

 $json = file_get_contents('php://input');
 $obj = json_decode($json, true);
$requestCode = $obj["requestCode"];
$projectId = $obj["projectId"];
if($requestCode == 1){
    $apis = $apiObj->requestDetails($projectId);
}
else{
    $apis = $apiObj->commonAPIs($obj);
}

echo $apis;

?>
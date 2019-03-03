<?php
include_once "lib/init.php";

include_once $ROOTPATH."/includes/class.request.php";

// error_reporting(E_ALL);
// ini_set("display_errors",1);

$requestObj = new REQUESTS();
 $json = file_get_contents('php://input');
 $obj = json_decode($json, true);
//  $obj = $_POST;
//  pr($obj);exit;
 if($obj["requestCode"] === 1){ //create
    $response = $requestObj->createRequest($obj);
 }
 elseif($obj["requestCode"] === 2){
     $requestStatus = $obj["requestStatus"];
     $response = $requestObj->requestDetails($requestStatus, $obj);
 }
 elseif($obj["requestCode"] === 3){
     $listingId = $obj["listingId"];
     $doNumber = $obj["DOId"];
     $response = $requestObj->getViewDetails($listingId, $doNumber);
 }
 elseif($obj["requestCode"] === 4){
     $listingId = $obj["listingId"];
     $listingStatus = $obj["approveStatus"];
     $remarks = $obj["approverComments"];
     $response = $requestObj->updateRequestStatus($listingId, $listingStatus, $remarks, $obj);
 }
 elseif($obj["requestCode"] === 5){

     $response = $requestObj->updateRequestDetails($obj);
 }
 elseif($obj["requestCode"] === 6){
    // echo "---".$obj["requestDetails"]["request"]["rawRequestType"];
     $response = $requestObj->generateDO($obj);
 }
  elseif($obj["requestCode"] === 7){

     $response = $requestObj->doApprove($obj);
 }
 elseif($obj["requestCode"] === 8){

     $response = $requestObj->collectionUpdate($obj);
 }
 elseif($obj["requestCode"] === 9){
    $requestStatus = $obj["requestStatus"];
     $response = $requestObj->getListings($requestStatus, $obj);
 }
 elseif($obj["requestCode"] === 10){
   
      $requestObj->setMismatchAlert($obj);
     $response = $requestObj->collectionUpdate($obj);
 }
 elseif($obj["requestCode"] === 11){
   
    $response = $requestObj->getAlerts();
}
elseif($obj["requestCode"] === 12){
   
    $response = $requestObj->EditAlerts($obj);
    
}
elseif($obj["requestCode"] === 13){

    $response = $requestObj->driverEdit($obj);
}
 

echo $response;

?>
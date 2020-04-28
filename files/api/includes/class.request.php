<?php
	include_once "lib/init.php";

class REQUESTS
{
	public $common;

	function __construct(){
		global $commonObj;
		$this->common = $commonObj;
	}
    function requestDetails($requestStatus){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("requestId","createdBy","notificationType","projectIdFrom","requestStatus");
		$whereClause = "requestStatus=".$requestStatus;
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$selectFileds,$whereClause);
		
		$projectArr = [];
		if($res[1] > 0){
			$projectArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$projectArr = []; //invalid login
		}
 
		return $this->common->arrayToJson($projectArr);
	}
    function getViewDetails($listingid){
            global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("requestId","createdBy","notificationType","projectIdFrom","description","requestStatus","remarks","approx","notificationNumber","driverId","vehicleId");
		$whereClause = "requestId='".$listingid."'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$selectFileds,$whereClause);
		
		$projectArr = [];
		if($res[1] > 0){
			$projectArr["request"] = $db->fetchArray($res[0]); 
		}
		else{
			$projectArr["request"] = []; //invalid login
		}
        
        $selectFileds=array("categoryId","subCategoryId","quantityRequested");
		$whereClause = "requestId='".$listingid."'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["MATREQUEST"],$selectFileds,$whereClause);
		
	
		if($res[1] > 0){
			$projectArr["matRequests"] = $db->fetchArray($res[0], 1); 
		}
		else{
			$projectArr["matRequests"] = []; //invalid login
		}
        
 
		return $this->common->arrayToJson($projectArr);
    }
	function updateRequestStatus($listingId, $listingStatus, $remarks){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;

		$dbm = new DB;
		$updateArr["requestStatus"]=trim($listingStatus);
		$updateArr["approverComments"] = trim($remarks);
		
        $dbcon = $dbm->connect('M',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$whereClause="requestId=".$listingId;
        $insid = $dbm->update($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$updateArr,$whereClause);
		$returnval["response"] ="success";
        $returnval["responsecode"] = 1; 
		return $this->common->arrayToJson($returnval);
	}
	function updateRequestDetails($postArr){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
 		$listingId = $postArr["listingId"];
		$dbm = new DB;
		$insertArr["notificationType"]=trim($postArr["cboProjectsFrom"]);
        $insertArr["projectIdFrom"]=trim($postArr["cboProjectsFrom"]);
        $insertArr["projectIdTo"]=trim($postArr["cboProjectsTo"]);
        $insertArr["description"]=trim($postArr["description"]);
        $insertArr["driverId"]=trim($postArr["driverName"]);
        $insertArr["vehicleId"]=trim($postArr["vehicleName"]);
        $insertArr["remarks"]=trim($postArr["txtRemarks"]);
        $insertArr["notificationNumber"]=trim($postArr["notificationNo"]);
        $insertArr["notificationType"]=trim($postArr["rdoRequestType"]);
        $insertArr["modifiedOn"] = date("Y-m-d H:i:s");
        $insertArr["requestStatus"] = trim($postArr["requestStatus"]);
		
        $dbcon = $dbm->connect('M',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$whereClause="requestId=".$listingId;
        $insid = $dbm->update($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$insertArr,$whereClause);

      
        $insertArr2["categoryId"]=trim($postArr["materialName"]);       
        $insertArr2["subCategoryId"]=trim($postArr["subCategorySel"]);
        $insertArr2["quantityRequested"]=trim($postArr["txtQty"]);
        $insid2 = $dbm->update($dbcon, $DBNAME["NAME"],$TABLEINFO["MATREQUEST"],$insertArr2,$whereClause);

		$returnval["response"] ="success";
        $returnval["responsecode"] = 1; 
		return $this->common->arrayToJson($returnval);
	}

	function createRequest($postArr){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;

        $insertArr["notificationType"]=trim($postArr["cboProjectsFrom"]);
        $insertArr["projectIdFrom"]=trim($postArr["cboProjectsFrom"]);
        $insertArr["projectIdTo"]=trim($postArr["cboProjectsTo"]);
        $insertArr["description"]=trim($postArr["description"]);
        $insertArr["driverId"]=trim($postArr["driverName"]);
        $insertArr["vehicleId"]=trim($postArr["vehicleName"]);
        $insertArr["remarks"]=trim($postArr["txtRemarks"]);
        $insertArr["notificationNumber"]=trim($postArr["notificationNo"]);
        $insertArr["notificationType"]=trim($postArr["rdoRequestType"]);
        $insertArr["createdOn"] = date("Y-m-d H:i:s");
        $insertArr["requestStatus"] = trim($postArr["requestStatus"]);
        
      
        
        $dbm = new DB;
        $dbcon = $dbm->connect('M',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
        $insid = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$insertArr,1,2);

        $insertArr2["requestId"]=$insid;       
        $insertArr2["categoryId"]=trim($postArr["materialName"]);       
        $insertArr2["subCategoryId"]=trim($postArr["subCategorySel"]);
        $insertArr2["quantityRequested"]=trim($postArr["txtQty"]);
        $insid2 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["MATREQUEST"],$insertArr2,1,2);
        $dbm->dbClose();
        if($insid == 0 || $insid == ''){ 
            $returnval["response"] ="fail";
               $returnval["responsecode"] = 0; 
        }else { 
            
            $returnval["response"] ="success";
            $returnval["responsecode"] = 1; 
            
            }
			
		
		
		return $this->common->arrayToJson($returnval);
	}
}

?>
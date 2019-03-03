<?php
	include_once "lib/init.php";
	

class REPORTS
{
	public $common;

	function __construct(){
		global $commonObj;
		$this->common = $commonObj;
    }

    function getCurrentBalance($catId, $subCatId){

		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;		
 		
		$dbm = new DB;
		$dbcon = $dbm->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$selectFileds=array("categoryId","subCategoryId","currentBalance, storeBalance, storeIn, storeOut, price");
		if(trim($catId) == "0"){
			$whereClause = "categoryId!=0";
		}
		else{
			if(trim($subCatId) == ""){
				$whereClause = "categoryId=".$catId;
			}
			else{
				$whereClause = "categoryId=".$catId." and subCategoryId=".$subCatId;
			}
		}
		$res=$dbm->select($dbcon, $DBNAME["NAME"],$TABLEINFO["SUBCATEGORY"],$selectFileds,$whereClause);
		$projectArr = array();
		if($res[1] > 0){
			$projectArr = $dbm->fetchArray($res[0], 1); 
			
		}
		return $this->common->arrayToJson($projectArr);

	}
	function idGenerator($id, $date){
		$month = date("y/m", strtotime($date));
		return "D".$month."/".sprintf("%'.04d\n", $id);
	
	}
	function getProjectReport_old($projectId){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;		
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$selectFileds=array("requestId",);
		// $whereClause = "(projectIdFrom=".$projectId." and (notificationType=1 or notificationType=2)) or (projectIdTo=".$projectId." and notificationType=3)"; //pld condition revisit it 
		$whereClause = "(projectIdFrom=".$projectId." or projectIdTo=".$projectId.")";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$selectFileds,$whereClause);
		
		$categoryArr = array();
		$finalReport = array();
		if($res[1] > 0){
			$categoryArr = $db->fetchArray($res[0], 1);
			foreach($categoryArr as $key=>$value){
				$selectField=array("categoryId","subCategoryId","quantityAccepted","requestStatus");
				$where = "requestId=".$value["requestId"]." and (requestStatus = 7 or requestStatus = 13 or requestStatus = 11)";
				$res2=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["DOGENERATIONHISTORY"],$selectField,$where);
				$listingDetails = array();
				if($res[1] > 0){
					$listingDetails = $db->fetchArray($res2[0], 1);  
				
					foreach($listingDetails as $k=>$details){
						
						$uid = $details["subCategoryId"];
						$finalReport[$uid]["categoryId"] = $details["categoryId"];
						if($details["requestStatus"] == "7" || $details["requestStatus"] == "11"){
							$finalReport[$uid]["requestedQuantity"] = $finalReport[$uid]["requestedQuantity"]+$details["quantityAccepted"];
						}
						elseif($details["requestStatus"] == "13"){
							$finalReport[$uid]["returnedQuantity"] = $finalReport[$uid]["returnedQuantity"]+$details["quantityAccepted"];
						}
						
					}
					
				}
				else{
					$finalReport=array();
				}					
			}
		}
		else{
			$finalReport=array();
		}
		// pr($finalReport);
		return $this->common->arrayToJson($finalReport);
	
	}
	function getProjectReport($projectId){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;		
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$selectFileds=array("categoryId","subCategoryId","requestedQty","recievedQty");
		// $whereClause = "(projectIdFrom=".$projectId." and (notificationType=1 or notificationType=2)) or (projectIdTo=".$projectId." and notificationType=3)"; //pld condition revisit it 
		$whereClause = "projectId=".$projectId;
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["PROJECTREPORT"],$selectFileds,$whereClause);
		
		$categoryArr = array();
		$finalReport = array();
		if($res[1] > 0){
			$categoryArr = $db->fetchArray($res[0], 1);
			foreach($categoryArr as $key=>$details){
				$uid = $details["subCategoryId"];
				$finalReport[$uid]["categoryId"] = $details["categoryId"];
			
				$finalReport[$uid]["requestedQuantity"] = $finalReport[$uid]["requestedQuantity"]+$details["requestedQty"];
		
				$finalReport[$uid]["returnedQuantity"] = $finalReport[$uid]["returnedQuantity"]+$details["recievedQty"];
			}
			
		}
		else{
			$finalReport=array();
		}
		// pr($finalReport);
		return $this->common->arrayToJson($finalReport);
	}
	function getSupervisorProjects($uid){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$selectFileds=array("projects");
		$whereClause = "userId=$uid";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["USERS"],$selectFileds,$whereClause);
		
		$projectArr = array();
		if($res[1] > 0){
			$projectArr = $db->fetchArray($res[0]);          	
			
		}
		else{
			$projectArr = array(); 
		}
		return $projectArr["projects"];
	}
	function notificationSearch($postData){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;	
		$postData["notificationno"] = str_replace("T","",$postData["notificationno"]);
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		$selectFileds=array("requestId","createdOn","createdBy","notificationType","requestNumber","requestStatus");
		$whereClause = array();
		if($postData["userType"] == "5"){
			$projectids=$this->getSupervisorProjects($postData["userId"]);
			array_push($whereClause,"projectIdFrom IN (".$projectids.")");
		}
		
		if(trim($postData["notificationno"])){
			array_push($whereClause,"requestNumber='".$postData["notificationno"]."' and requestStatus!=99");
			
		}
		if(trim($postData["startDate"]) != "" && trim($postData["endDate"]) ==""){
			array_push($whereClause,"date(createdOn)='".date("Y-m-d",strtotime($postData["startDate"]))."'");
		}
		if(trim($postData["startDate"]) == "" && trim($postData["endDate"]) !=""){
			array_push($whereClause,"date(createdOn)='".date("Y-m-d",strtotime($postData["endDate"]))."'");
		}
		if(trim($postData["startDate"]) != "" && trim($postData["endDate"]) !=""){
			array_push($whereClause,"date(createdOn)>='".date("Y-m-d",strtotime($postData["startDate"]))."' AND date(createdOn)<='".date("Y-m-d",strtotime($postData["endDate"]))."'");
		}
	
		$whereClauseFinal=implode(" AND ",$whereClause);
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$selectFileds,$whereClauseFinal);
		
		$categoryArr = array();
		$finalReport = array();
		// pr($db);
		if($res[1] > 0){
			$categoryArr = $db->fetchArray($res[0], 1);
			
			foreach($categoryArr as $key=>$value){
				$uid = $value["requestId"];
				$finalReport[$uid]["requestId"] = $value["requestNumber"];
				$finalReport[$uid]["requestIdRaw"] = $value["requestId"];
				$finalReport[$uid]["createdOn"] = $value["createdOn"];
				$finalReport[$uid]["createdBy"] = $value["createdBy"];
				$finalReport[$uid]["notificationType"] = $value["notificationType"];
				$finalReport[$uid]["requestStatus"] = $value["requestStatus"];

				$selectField=array("requestStatus","DONumber","driverId","vehicleId","createdOn");
				$where = "requestId=".$value["requestId"];
				$res2=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["DOGENERATIONHISTORY"],$selectField,$where);
				$listingDetails = array();
				if($res[1] > 0){
					$listingDetails = $db->fetchArray($res2[0], 1);  
					$idsArr = array();
					foreach($listingDetails as $k=>$details){
						$doNumbers = $this->idGenerator($details["DONumber"],$details["createdOn"]);
						$idsArr[$doNumbers] = $doNumbers;
						$finalReport[$uid]["DONumber"] = implode(",", $idsArr);
						$finalReport[$uid]["requestStatus"] = $details["requestStatus"];
						$finalReport[$uid]["driverId"] = $details["driverId"];
						$finalReport[$uid]["vehicleId"] = $details["vehicleId"];	
						$finalReport[$uid]["DONumberRaw"] = $details["DONumber"];					
						
					}
					
				}
				else{
					$finalReport=array();
				}					
			}
		
			
		}
		else{
			$finalReport=array();
		}
		return $this->common->arrayToJson($finalReport);
	}
}
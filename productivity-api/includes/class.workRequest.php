<?php
    include_once "lib/init.php";
    
class WORKREQUESTS
{
	public $common;

	function __construct(){
		global $commonObj;
		$this->common = $commonObj;
	}
    function createWorkRequest($postArr){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		
       
			$insertArr["projectId"]=trim($postArr["value_projects"]);
			$insertArr["clientId"]=trim($postArr["value_clients"]);
			$insertArr["status"]=1;
			$insertArr["requestedBy"]=trim($postArr["requestBy"]);
			$insertArr["contractType"]=trim($postArr["cType"]);		
            $insertArr["remarks"]=trim($postArr["remarks"]);
            $insertArr["scaffoldRegister"] = trim($postArr["scaffoldRegister"]);
			$insertArr["createdOn"]=date("Y-m-d H:i:s");
			$insertArr["createdBy"]=trim($postArr["userId"]);	

			
			$dbm = new DB;
			$dbcon = $dbm->connect('M',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
			
			$insid = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUEST"],$insertArr,1,2);
			if($insid != 0 && $insid != ''){ 
                if(trim($postArr["cType"]) == 1){ //if its original contarct
                    $this->insertItemList($postArr, $insid);
                }
                if(trim($postArr["cType"]) == 2){ //if its variaion works
                    $this->insertVariationWorks($postArr, $insid);
                }
            }
			
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

    function insertVariationWorks($postArr, $insid){
        global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
        $dbm = new DB;
        $dbcon = $dbm->connect('M',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
        $insertItemArr["workRequestId"] = $insid;
        $insertItemArr["contractType"] = trim($postArr["cType"]);
        $insertItemArr["itemId"] = 0;
        $insertItemArr["workBased"] = $postArr["workBased"];
        $insertItemArr["sizeType"] = $postArr["sizeType"];
        $insertItemArr["createdOn"] = date("Y-m-d H:i:s");
        $insid2 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTITEMS"],$insertItemArr,1,2);

        if($insid2 != 0 && $insid2 != ''){
            if($postArr["workBased"] == 1){
                foreach($postArr["sizeList"] as $itemList){
                    $insertSizeArr["workRequestId"] = $insid;
                    $insertSizeArr["itemListId"] = $insid2;
                    $insertSizeArr["scaffoldType"] = $itemList["value_scaffoldType"];
                    $insertSizeArr["scaffoldWorkType"] = $itemList["value_scaffoldWorkType"];
                    $insertSizeArr["scaffoldSubCategory"] = $itemList["value_scaffoldSubCategory"];
                    $insertSizeArr["length"] = $itemList["L"];
                    $insertSizeArr["height"] = $itemList["H"];
                    $insertSizeArr["width"] = $itemList["W"];
                    $insertSizeArr["setcount"] = $itemList["Set"];
                    $insertSizeArr["createdOn"] = date("Y-m-d H:i:s");
                    $insid3 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTSIZEBASED"],$insertSizeArr,1,2);
                }
            }
            if($postArr["workBased"] == 2){
                foreach($postArr["manpowerList"] as $itemList){
                    $insertManPowerArr["workRequestId"] = $insid;
                    $insertManPowerArr["itemListId"] = $insid2;
                    $insertManPowerArr["safety"] = $itemList["safety"];
                    $insertManPowerArr["supervisor"] = $itemList["supervisor"];
                    $insertManPowerArr["erectors"] = $itemList["erectors"];
                    $insertManPowerArr["generalWorker"] = $itemList["gworkers"];
                    $insertManPowerArr["timeIn"] = $itemList["inTime"];
                    $insertManPowerArr["timeOut"] = $itemList["outTime"];
                    $insertManPowerArr["createdOn"] = date("Y-m-d H:i:s");
                    $insid4 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTMANPOWER"],$insertManPowerArr,1,2);
                }
            }
        }
    }
    
    function insertItemList($postArr, $insid){
        global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
        $dbm = new DB;
        $dbcon = $dbm->connect('M',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
        foreach($postArr["itemList"] as $itemList){

            $insertItemArr["workRequestId"] = $insid;
            $insertItemArr["contractType"] = trim($postArr["cType"]);
            $insertItemArr["itemId"] = $itemList["value_item"];
            $insertItemArr["workBased"] = $itemList["workBased"];
            $insertItemArr["sizeType"] = $itemList["sizeType"];
            $insertItemArr["createdOn"] = date("Y-m-d H:i:s");
            $insid2 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTITEMS"],$insertItemArr,1,2);
            

                if($insid2 != 0 && $insid2 != ''){
                    if($itemList["workBased"] == 1){ //size
                        $insertSizeArr["workRequestId"] = $insid;
                        $insertSizeArr["itemListId"] = $insid2;
                        $insertSizeArr["scaffoldType"] = $itemList["value_scaffoldType"];
                        $insertSizeArr["scaffoldWorkType"] = $itemList["value_scaffoldWorkType"];
                        $insertSizeArr["scaffoldSubCategory"] = $itemList["value_scaffoldSubCategory"];
                        $insertSizeArr["length"] = $itemList["L"];
                        $insertSizeArr["height"] = $itemList["H"];
                        $insertSizeArr["width"] = $itemList["W"];
                        $insertSizeArr["setcount"] = $itemList["Set"];
                        $insertSizeArr["createdOn"] = date("Y-m-d H:i:s");
                        $insid3 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTSIZEBASED"],$insertSizeArr,1,2);
                       
                    }
                    if($itemList["workBased"] == 2){ //manpower
                        $insertManPowerArr["workRequestId"] = $insid;
                        $insertManPowerArr["itemListId"] = $insid2;
                        $insertManPowerArr["safety"] = $itemList["safety"];
                        $insertManPowerArr["supervisor"] = $itemList["supervisor"];
                        $insertManPowerArr["erectors"] = $itemList["erectors"];
                        $insertManPowerArr["generalWorker"] = $itemList["gworkers"];
                        $insertManPowerArr["timeIn"] = $itemList["inTime"];
                        $insertManPowerArr["timeOut"] = $itemList["outTime"];
                        $insertManPowerArr["createdOn"] = date("Y-m-d H:i:s");
                        $insid4 = $dbm->insert($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTMANPOWER"],$insertManPowerArr,1,2);
                       
                    }

                }
        }
    }

	function getWorkRequestList($postArr){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("workRequestId","projectId","clientId","requestedBy");

		if($postArr["startDate"] && $postArr["startDate"]!=""){
			$addCond = "date(createdOn)='".$postArr["startDate"]."'";
		}
		else{
			$addCond = "date(createdOn)='".date("Y-m-d")."'";
		}		
		$whereClause = "status=".$postArr["requestType"]." AND $addCond order by workRequestId desc";
		
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUEST"],$selectFileds,$whereClause);
		// pr($db);
		$usersArr = array();
		if($res[1] > 0){
			$usersArr = $db->fetchArray($res[0], 1);
		}
		// pr($usersArr);
 
		return $this->common->arrayToJson($usersArr);
    }
    
    function getWorkRequestDetails($postArr){

        global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("workRequestId","projectId","clientId","requestedBy","contractType","scaffoldRegister","remarks");
    	$whereClause = "workRequestId='".$postArr["listingId"]."'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUEST"],$selectFileds,$whereClause);
		// pr($db);
		$requestArr = array();
		if($res[1] > 0){
            $requestArr["requestDetails"] = $db->fetchArray($res[0]);
            
            $selectFiledsitem=array("id","workRequestId","itemId","sizeType","workBased");
            $whereClauseitem = "workRequestId='".$postArr["listingId"]."'";
            $resitem=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTITEMS"],$selectFiledsitem,$whereClauseitem);
            if($resitem[1] > 0){
                $itemList = $db->fetchArray($resitem[0],1);
                $k=0;
                foreach($itemList as $item){

                    if($item["workBased"] == 1){
                        $selectFiledsSize=array("id","itemListId","scaffoldType","scaffoldWorkType","scaffoldSubCategory","length","height", "width","setcount");
                        $whereClauseSize = "workRequestId='".$postArr["listingId"]."' and itemListId=".$item["id"];
                        $resSize=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTSIZEBASED"],$selectFiledsSize,$whereClauseSize);
                        $requestArr["requestItems"][$k] = $item;

                        if($resSize[1] > 0){
                            $sizeList = $db->fetchArray($resSize[0],1);
                            $i=0;
                            foreach($sizeList as $sizeDet){
                                $requestArr["requestSizeList"][$i] = $sizeDet;
                                $i++;
                            }
                           
                        }
                    }
                    else if($item["workBased"] == 2){

                        $selectFiledsMan=array("id","itemListId","safety","supervisor","erectors","generalWorker","timeIn", "timeOut");
                        $whereClauseMan = "workRequestId='".$postArr["listingId"]."' and itemListId=".$item["id"];
                        $resMan=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUESTMANPOWER"],$selectFiledsMan,$whereClauseMan);
                        $requestArr["requestItems"][$k] = $item;

                        if($resMan[1] > 0){
                            $manList = $db->fetchArray($resMan[0],1);
                            $j=0;
                            foreach($manList as $manDet){
                                $requestArr["requestManList"][$j] = $manDet;
                                $j++;
                            }
                        }
                    }
                    $k++;
                }
            }
        }
        
        return $this->common->arrayToJson($requestArr);

    }
}

?>
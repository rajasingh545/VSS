<?php
	include_once "lib/init.php";

class commonAPI
{
	public $common;

	function __construct(){
		global $commonObj;
		$this->common = $commonObj;
	}

	function commonAPIs($obj){
		
        $allDetails = array();
		$allDetails["projects"] = $this->projectDetails($obj);
        $allDetails["workers"] = $this->workerDetails();
        // $allDetails["supervisors"] = $this->supervisorDetails();
        // $allDetails["category"] = $this->categoryDetails();
        // $allDetails["subCategory"] = $this->subCategoryDetails();
		// $allDetails["users"] = $this->usersDetails();
		// $allDetails["allprojects"] = $this->allProjectDetails();
		// $allDetails["requestDetails"] = $this->requestDetails();
        
		return $this->common->arrayToJson($allDetails);
	}
    function projectDetails($obj){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("projectId","projectName");		
		$whereClause = "projectStatus='1'";	
		
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["PROJECTS"],$selectFileds,$whereClause);
		
		$projectArr = array();
		if($res[1] > 0){
			$projectArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$projectArr = array(); 
		}
 
		return $projectArr;
	}
	function allProjectDetails($obj){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("projectId","projectName");
		
		$whereClause = "projectStatus='1'";
		
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["PROJECTS"],$selectFileds,$whereClause);
		
		$projectArr = array();
		if($res[1] > 0){
			$projectArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$projectArr = array(); 
		}
 
		return $projectArr;
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
    function workerDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("workerName","workerId");
		$whereClause = "status=1";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKERS"],$selectFileds,$whereClause);
		
		$driverArr = array();
		if($res[1] > 0){
			$driverArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$driverArr=array(); 
		}
 
		return $driverArr;
	}
    function supervisorDetails($pid){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("userId","Name");
		
		$whereClause = "project=$pid and userStatus=1";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["USERS"],$selectFileds,$whereClause);
		
		$vehiclesArr = array();
		if($res[1] > 0){
			$vehiclesArr["supervisors"] = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$vehiclesArr["supervisors"]=array(); 
		}
		
		return $this->common->arrayToJson($vehiclesArr);
	}
    function categoryDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("categoryId","categoryName");
		$whereClause = "categoryStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["CATEGORY"],$selectFileds,$whereClause);
		
		$categoryArr = array();
		if($res[1] > 0){
			$categoryArr = $db->fetchArray($res[0], 1);
		}
		else{
			$categoryArr=array();
		}
 
		return $categoryArr;
	}
	function requestDetails($projectId){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("requestId","createdOn","requestStatus","requestNumber");
		$whereClause = "requestStatus >= 3 AND requestStatus <= 5 AND notificationType=1 and projectIdFrom=".$projectId;
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["REQUEST"],$selectFileds,$whereClause);
		
		$categoryArr = array();
		$doNumbers = array();
		if($res[1] > 0){
			$categoryArr = $db->fetchArray($res[0], 1);
			foreach($categoryArr as $key=>$value){
				 $doNumbers[$key]["requestNo"] = $value["requestNumber"];
					$doNumbers[$key]["requestId"] = $value["requestId"];

					$selectFileds=array("requestId","categoryId","subCategoryId","quantityRequested");
					$whereClause2 = "requestId=".$value["requestId"];
					if($value["requestStatus"] == 3){
						$res2=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["MATREQUEST"],$selectFileds,$whereClause2);
					}
					else{
						$res2=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["DOGENERATIONHISTORY"],$selectFileds,$whereClause2);
					}
					// pr($res2);
					$results = $db->fetchArray($res2[0], 1);
					$requestarr = array(); 
					foreach($results as $request){
						$uniqueid = $request["categoryId"]."-".$request["subCategoryId"];
						$requestarr[$uniqueid] = $request["quantityRequested"];
						$doNumbers[$key]["requests"] = $requestarr;
					}
			}
		}
		else{
			$doNumbers=array();
		}
		
		
 
		return $this->common->arrayToJson($doNumbers);
	}
	function idGenerator($id, $date){
		$month = date("m", strtotime($date));
		return $month."/".sprintf("%'.04d\n", $id);
	
	}
    function subCategoryDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("subCategoryId", "categoryId", "subCategoryName","price");
		$whereClause = "subCategoryStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["SUBCATEGORY"],$selectFileds,$whereClause);
		
		$subCategoryArr = array();
		if($res[1] > 0){
			$resultArrArr = $db->fetchArray($res[0], 1);  
            foreach($resultArrArr as $key => $value){
                $subCategoryArr[$key] = $value;
            }       	
			
		}
		else{
			$subCategoryArr=array(); 
		}
 
		return $subCategoryArr;
	}
	function usersDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("Name","userId");
		$whereClause = "userStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["USERS"],$selectFileds,$whereClause);
		
		$usersArr = array();
		if($res[1] > 0){
			$usersArr = $db->fetchArray($res[0], 1);
		}
		else{
			$usersArr=array(); 
		}
 
		return $usersArr;
	}
    
}

?>

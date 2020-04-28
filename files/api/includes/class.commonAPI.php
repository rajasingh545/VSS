<?php
	include_once "lib/init.php";

class commonAPI
{
	public $common;

	function __construct(){
		global $commonObj;
		$this->common = $commonObj;
	}

	function commonAPIs(){
		
        $allDetails = [];
		$allDetails["projects"] = $this->projectDetails();
        $allDetails["drivers"] = $this->driverDetails();
        $allDetails["vehicles"] = $this->vehicleDetails();
        $allDetails["category"] = $this->categoryDetails();
        $allDetails["subCategory"] = $this->subCategoryDetails();
		$allDetails["users"] = $this->usersDetails();
        
		return $this->common->arrayToJson($allDetails);
	}
    function projectDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("projectId","projectName");
		$whereClause = "projectStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["PROJECTS"],$selectFileds,$whereClause);
		
		$projectArr = [];
		if($res[1] > 0){
			$projectArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$projectArr = []; 
		}
 
		return $projectArr;
	}
    function driverDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("driverId","driverName");
		$whereClause = "driverStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["DRIVERS"],$selectFileds,$whereClause);
		
		$driverArr = [];
		if($res[1] > 0){
			$driverArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$driverArr=[]; 
		}
 
		return $driverArr;
	}
    function vehicleDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("vehicleId","vehicleNumber");
		$whereClause = "vehicleStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["VEHICLES"],$selectFileds,$whereClause);
		
		$vehiclesArr = [];
		if($res[1] > 0){
			$vehiclesArr = $db->fetchArray($res[0], 1);          	
			
		}
		else{
			$vehiclesArr=[]; 
		}
 
		return $vehiclesArr;
	}
    function categoryDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("categoryId","categoryName");
		$whereClause = "categoryStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["CATEGORY"],$selectFileds,$whereClause);
		
		$categoryArr = [];
		if($res[1] > 0){
			$categoryArr = $db->fetchArray($res[0], 1);
		}
		else{
			$categoryArr=[];
		}
 
		return $categoryArr;
	}
    function subCategoryDetails(){
		global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		$db = new DB;
		$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		$selectFileds=array("subCategoryId", "categoryId", "subCategoryName");
		$whereClause = "subCategoryStatus='1'";
		$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["SUBCATEGORY"],$selectFileds,$whereClause);
		
		$subCategoryArr = [];
		if($res[1] > 0){
			$resultArrArr = $db->fetchArray($res[0], 1);  
            foreach($resultArrArr as $key => $value){
                $subCategoryArr[$key] = $value;
            }       	
			
		}
		else{
			$subCategoryArr=[]; 
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
		
		$usersArr = [];
		if($res[1] > 0){
			$usersArr = $db->fetchArray($res[0], 1);
		}
		else{
			$usersArr=[]; 
		}
 
		return $usersArr;
	}
    
}

?>

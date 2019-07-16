<?php
	include_once "lib/init.php";
	

class REPORTS
{
	public $common;

	function __construct(){
		global $commonObj;
		$this->common = $commonObj;
    }

    // function supervisorReport($obj){
	// 	global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
	// 	$db = new DB;
	// 	$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
	// 	$selectFileds=array("scaffoldSubCateId", "scaffoldSubCatName");
	// 	$whereClause = "scaffoldTypeId!=0";
	// 	$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["SCAFFOLDSUBCATEGORY"],$selectFileds,$whereClause);
	// 	$supervisor = 1;
	// 	$subCategoryArr = array();
	// 	if($res[1] > 0){
	// 		$resultArrArr = $db->fetchArray($res[0], 1)	;  
    //         foreach($resultArrArr as $key => $value){				
	// 			$subCategoryArr[$value["scaffoldSubCatName"]] = $this->getCategoryWiseCount($value["scaffoldSubCateId"], $supervisor);
	// 		} 
	// 	}
	// 	else{
	// 		$subCategoryArr=array(); 
	// 	}
 
	// 	return  $this->common->arrayToJson($subCategoryArr);
	// }
	// function getCategoryWiseCount($catid, $supervisor){
	// 	global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
	// 	$db = new DB;
	// 	$workTrackIds = $this->getSupervisorDailyWorkTrackIds($supervisor);
	// 	$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
	// 	$selectFileds=array("worktrackId");
	// 	$whereClause = "worktrackId IN(".$supervisor.") AND ";
	// 	$res=$db->select($dbcon, $DBNAME["NAME"], $TABLEINFO["DAILYWORKTRACK"], $selectFileds, $whereClause);
	// 	if($res[1] > 0){
	// 		$resultArrArr = $db->fetchArray($res[0], 1)	;  
    //         foreach($resultArrArr as $key => $value){

	// 		}
	// 	}


	// }

	// function getSupervisorDailyWorkTrackIds($supervisor){
	// 	$db = new DB;
	// 	$dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
	// 	$selectFileds=array("worktrackId");
	// 	$whereClause = "baseSupervisor=".$supervisor;
	// 	$res=$db->select($dbcon, $DBNAME["NAME"],$TABLEINFO["WORKREQUEST"],$selectFileds,$whereClause);
	// 	if($res[1] > 0){
	// 		$resultArrArr = $db->fetchArray($res[0], 1)	;  
    //         foreach($resultArrArr as $value){	
	// 			$returnValue[] = $value["worktrackId"];
	// 		}
	// 	}
	// 	return implode(",",$returnValue)
	// }

	function dwtrReport(){
global $DBINFO,$TABLEINFO,$SERVERS,$DBNAME;
		// $db = new DB;
		// $dbcon = $db->connect('S',$DBNAME["NAME"],$DBINFO["USERNAME"],$DBINFO["PASSWORD"]);
		
		// $res=$db->execute_direct_query($dbcon, "CALL sp_productivityReport();");

		


		

		//run the store proc
		$connection = mysqli_connect("localhost", $DBINFO["USERNAME"], $DBINFO["PASSWORD"], $DBNAME["NAME"]);
			$result = mysqli_query($connection, "CALL sp_productivityReport") or die("Query fail: " . mysqli_error($connection));
			$resultset = array();
			$column = array();
			while ($row = mysqli_fetch_assoc($result)) {
				
				$resultset[] = $row;
			}
			$finalarray["column"] = array_keys($resultset[1]);
			$finalarray["resultset"] = $resultset;
		return $this->common->arrayToJson($finalarray);
	}
}
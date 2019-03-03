<?php
/*
DB details defined here
*/

$DBINFO["USERNAME"] = "root";
$DBINFO["PASSWORD"] = "";
$MYSQLPORT = 3306;

$DBNAME["NAME"] = "v_productivity";

$TABLEINFO["USERS"] = "p_users";
$TABLEINFO["PROJECTS"] = "p_projects";
$TABLEINFO["WORKERS"] = "p_workers";
$TABLEINFO["SUPERVISORS"] = "p_supervisor";
$TABLEINFO["CATEGORY"] = "v_category";
$TABLEINFO["SUBCATEGORY"] = "v_subcategory";
$TABLEINFO["STATUS"] = "v_status";
$TABLEINFO["REQUEST"] = "v_requests";
$TABLEINFO["MATREQUEST"] = " v_materialrequests";
$TABLEINFO["DOGENERATIONHISTORY"] = "v_dogenerationhistory";
$TABLEINFO["TRANSFERHISTORY"] = "v_transferhistory";
$TABLEINFO["PROJECTREPORT"] = "v_projectreport";

$TABLEINFO["MISATCHALERT"] = "v_misatchalert";

$SERVERS['DBHOST_MASTER'] = "localhost";
$SERVERS['DBHOST_SLAVE'] = "localhost";

?>
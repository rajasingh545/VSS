<?php
include_once "lib/init.php";

include_once $ROOTPATH."/includes/class.commonAPI.php";

$apiObj = new commonAPI();

$apis = $apiObj->commonAPIs();

echo $apis;

?>
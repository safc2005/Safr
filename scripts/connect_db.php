<?php
DEFINE ('DB_USER', 'stephenn_safr');
DEFINE ('DB_PSWD', 'sendToSafr321');
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'stephenn_safr');
$dbcon = mysql_connect(DB_HOST, DB_USER, DB_PSWD, DB_NAME) or die(mysql_error());
mysql_select_db(DB_NAME) or die(mysql_error());
?>
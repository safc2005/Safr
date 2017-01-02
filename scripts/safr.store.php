<?php
	//including the connection details
	include 'connect_db.php';

	$id = $_POST['ID'];
	$month = $_POST['search_month'];
	$year = $_POST['search_year'];
	$lat = $_POST['latitude'];
	$lon = $_POST['longitude'];
	$ip = $_POST['ip'];
	$city = $_POST['city'];
	$country = $_POST['country'];
	$time = $_POST['search_time'];

	$sql = "INSERT INTO dashboard (ID, search_month, search_year, latitude, longitude, ip, city, country, search_time) 
	VALUES ('$id', '$month', '$year', '$lat', '$lon', '$ip', '$city', '$country', '$time')";

	$query = mysql_query($sql,$dbcon);

	if(!$query)
	{
	  die('Could not enter data: ' . mysql_error());
	}

	mysql_close($dbcon);	
?>
<?php
	require("state.php");
	error_reporting (E_ALL); 

	$json = file_get_contents('php://input');
	$obj = json_decode($json);

	$nodeNames = [];

	$nodes = [];

	foreach ($obj->nodes as $key => $value) {
		array_push($nodeNames, $value->name);
		// print_r($value);
	}

	$final = powerSet($nodeNames);
	print_r($final);
?>
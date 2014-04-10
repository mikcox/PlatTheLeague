<?php 
session_start();

if(isset($_POST['ChampionName']))

{
    $Champion = $_POST['ChampionName']."";
	exec('python get_counter_info.py '.$Champion);
}

?>
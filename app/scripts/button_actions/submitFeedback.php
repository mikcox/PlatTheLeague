<?php 
session_start();

if(isset($_POST['Feedback'])){
    $feedback = $_POST['Feedback']."";
	$outputFileName = "./feedback/feedback_".date('m-d-Y').".json";
	if(!file_exists($outputFileName)){
		file_put_contents($outputFileName, $feedback);
	} else {
		$fileContents = file_get_contents($outputFileName);
		$fileContentsJSON = json_decode($fileContents);
		$commentsArray = $fileContentsJSON -> {'feedback'};
		$feedbackJSON = json_decode($feedback);
		array_push($commentsArray, $feedbackJSON -> {'feedback'} [0] );
		$fileContentsJSON -> {'feedback'} = $commentsArray;
		$fileContents = json_encode($fileContentsJSON);
		file_put_contents($outputFileName, $fileContents);
	}
}

?>
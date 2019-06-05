
<?php
    require "functions.php";

	//header("Access-Control-Allow-Origin: *");
	//error_reporting(0);
	//@ini_set('display_errors', 0);
	
    // Get passed values
	$dbname = $_GET['dbname'];

    // Create connection
    $conn = connect($dbname);

    // Variables to collect
	$Level_ID = array();
	$Name = array();	
	$result = c_mysqli_call($conn, 'p_GetLevel', '');
	if($result)  {
		foreach($result as $_row) {
			$Level_ID[] = $_row['Level_ID'];
			$Name[] = $_row['Name'];	
		}
	}

	$conn->close();
?>

{
	"Level_ID": <?php echo json_encode($Level_ID); ?>,
	"Name": <?php echo json_encode($Name); ?>
}



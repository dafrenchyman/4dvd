
<?php
    require "functions.php";

    //header("Access-Control-Allow-Origin: *");
	//error_reporting(0);
	//@ini_set('display_errors', 0);

    // Get passed values
	$dbname = $_GET['dbname'];
	$gridboxId = $_GET['gridboxId'];
	$level = $_GET['level'];

    // Create connection
    $conn = connect($dbname);

    // Variables to collect
	$Date = array();
	$Value = array();
	$result = c_mysqli_call($conn, 'p_GetTimeseriesData', $level . ',' . $gridboxId);

	if($result)  {
		foreach($result as $_row) {
			$Date[] = $_row['Date'];
			if ($_row['Value'] != NULL) {
				$Value[] = $_row['Value'] + 0;
			} else {
				$Value[] = $_row['Value'];
			}
		}
	}

	$conn->close();
?>

{
	"Date": <?php echo json_encode($Date); ?>,
	"Value": <?php echo json_encode($Value); ?>
}


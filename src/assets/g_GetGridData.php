
<?php
    require "functions.php";

	//header("Access-Control-Allow-Origin: *");
    //error_reporting(0);
	//@ini_set('display_errors', 0);

    // Get passed values
	$dbname = $_GET['dbname'];
	$date = $_GET['date'];
	$level = $_GET['level'];

    // for testing
    if (false) {
        $dbname = "mrsharky_noaa20v2c_Der_Mon_press_air_mon_ltm";
        $date = "0001-01-01";
        $level = "1";
    }

    // Create connection
    $conn = connect($dbname);

    // Variables to collect
	$GridBox_ID = array();
	$Lat = array();	
	$Lon = array();
	$Value = array();
	$result = c_mysqli_call($conn, 'p_GetGridData', $level . ',\''.$date. '\'');
	if($result)  {
		foreach($result as $_row) {
			$GridBox_ID[] = $_row['GridBox_ID'] + 0;
			$Lat[] = $_row['Lat'] + 0;
			$Lon[] = $_row['Lon'] + 0;
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
	"GridBox_ID": <?php echo json_encode($GridBox_ID); ?>,
	"Lat": <?php echo json_encode($Lat); ?>,
	"Lon": <?php echo json_encode($Lon); ?>,
	"Value": <?php echo json_encode($Value); ?>
}


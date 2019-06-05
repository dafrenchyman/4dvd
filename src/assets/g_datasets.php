
<?php
    require "functions.php";

	//error_reporting(~E_ALL & ~E_NOTICE & ~E_USER_NOTICE);
	//error_reporting(0);
    //@ini_set('display_errors', 0);
    
	$dbname = 'mrsharky_GriddedClimateData';

	// Create connection
    $conn = connect($dbname);

	// Variables to collect
	$Dataset_ID = array();
	$Name = array();
	$DatabaseStore = array();
	$OriginalLocation  = array();
	$StartDate = array();
	$EndDate = array();
	$Units = array();
	$DefaultLevel = array();
	$result = c_mysqli_call($conn, 'g_Dataset', '');
	if($result) {
		foreach($result as $_row) {
			$Dataset_ID[] = $_row['Dataset_ID'];
			$Name[] = $_row['Name'];
			$DatabaseStore[] = $_row['DatabaseStore'];
			$OriginalLocation[] = $_row['OriginalLocation'];
			$StartDate[] = $_row['StartDate'];
			$EndDate[] = $_row['EndDate'];
			$Units[] = $_row['Units'];
			$DefaultLevel[] = $_row['DefaultLevel'];
		}
	}

	$conn->close();

?>
{
	"Dataset_ID": <?php echo json_encode($Dataset_ID); ?>,
	"Name": <?php echo json_encode($Name); ?>,
	"DatabaseStore": <?php echo json_encode($DatabaseStore); ?>,
	"OriginalLocation": <?php echo json_encode($OriginalLocation); ?>,
	"StartDate": <?php echo json_encode($StartDate); ?>,
	"EndDate": <?php echo json_encode($EndDate); ?>,
	"Units": <?php echo json_encode($Units); ?>,
	"DefaultLevel": <?php echo json_encode($DefaultLevel); ?>
}


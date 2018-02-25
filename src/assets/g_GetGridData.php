
<?php

	header("Access-Control-Allow-Origin: *");

	error_reporting(0);
	@ini_set('display_errors', 0);

	/**
	 * Calls a Stored Procedure and returns the results as an array of rows.
	 * @param mysqli $dbLink An open mysqli object.
	 * @param string $procName The name of the procedure to call.
	 * @param string $params The parameter string to be used
	 * @return array An array of rows returned by the call.
	 */
	function c_mysqli_call(mysqli $dbLink, $procName, $params="")
	{
	    if(!$dbLink) 
		{
			throw new Exception("The MySQLi connection is invalid.");
		}
		else
		{
			// Execute the SQL command.
			// The multy_query method is used here to get the buffered results,
			// so they can be freeded later to avoid the out of sync error.
			$sql = "CALL {$procName}({$params});";
			$sqlSuccess = $dbLink->multi_query($sql);

			if($sqlSuccess)
			{
				if($dbLink->more_results())
				{
					// Get the first buffered result set, the one with our data.
					$result = $dbLink->use_result();
					$output = array();
					// Put the rows into the outpu array
					while($row = $result->fetch_assoc())
					{
					    $output[] = $row;
					}
					// Free the first result set.
					// If you forget this one, you will get the "out of sync" error.
					$result->free();
					// Go through each remaining buffered result and free them as well.
					// This removes all extra result sets returned, clearing the way
					// for the next SQL command.
					while($dbLink->more_results() && $dbLink->next_result())
					{
					    $extraResult = $dbLink->use_result();
					    if($extraResult instanceof mysqli_result)
						{
					        $extraResult->free();
					    }
					}
					return $output;
				}
				else
				{
					return false;
				}
			}
			else
			{
				throw new Exception("The call failed: " . $dbLink->error);
			}
		}
	}


	$servername = "localhost";
	$username = "mrsharky_climate";
	$password = "";
	$dbname = $_GET['dbname'];
	$date = $_GET['date'];
	$level = $_GET['level'];
	//$dbname = "Ncp20CRA2c_Mon_press_air_mon_mean";
	//$date = "1851-01-01";
	//$level = "1";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) 
	{
		 die("Connection failed: " . $conn->connect_error);
	} 
	// Grab variables from address field
	//$predictor_variable1_id = $_GET['predictor_variable1_id'];
	//$predictor_variable2_id = $_GET['predictor_variable2_id'];
	//$response_valiable_id = $_GET['response_variable_id'];

	// Response Variable data

	// Bi-variate Histogram Data
	$GridBox_ID = array();
	$Lat = array();	
	$Lon = array();
	$Value = array();
	$result = c_mysqli_call($conn, 'p_GetGridData', $level . ',\''.$date. '\'');
	if($result) 
	{
		foreach($result as $_row)
		{
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


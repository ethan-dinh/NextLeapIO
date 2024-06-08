<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('login_info.txt');

$conn = mysqli_connect($server, $user, $pass, $dbname, $port)
or die('Error connecting to MySQL server!');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $planID = mysqli_real_escape_string($conn, $_GET['planID']);

    // Log the received planID
    error_log("Received planID: $planID");

    // Check if planID exists in FuturePlans
    $check_plan_query = "SELECT planID FROM FuturePlans WHERE planID = '$planID'";
    $result = $conn->query($check_plan_query);

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => "PlanID $planID does not exist - $planID"]);
        $conn->close();
        exit();
    }

    // Begin transaction
    $conn->begin_transaction();

    try {
        // Query to delete location coordinates
        $delete_location_query = "DELETE FROM LocationCoordinates WHERE planID = '$planID'";
        error_log("Executing query: $delete_location_query");
        if ($conn->query($delete_location_query) !== TRUE) {
            throw new Exception("Error deleting location coordinates: " . $conn->error);
        }

        // Check the affected rows for the location delete query
        if ($conn->affected_rows == 0) {
            throw new Exception("No rows affected when deleting from LocationCoordinates. PlanID: $planID");
        }

        // Query to delete the plan
        $delete_plan_query = "DELETE FROM FuturePlans WHERE planID = '$planID'";
        error_log("Executing query: $delete_plan_query");
        if ($conn->query($delete_plan_query) !== TRUE) {
            throw new Exception("Error deleting plan: " . $conn->error);
        }

        // Check the affected rows for the plan delete query
        if ($conn->affected_rows == 0) {
            throw new Exception("No rows affected when deleting from FuturePlans. PlanID: $planID");
        }

        // Commit transaction
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Plan deleted successfully']);
    } catch (Exception $e) {
        // Rollback transaction
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }

    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

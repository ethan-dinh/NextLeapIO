<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('login_info.txt');

$conn = mysqli_connect($server, $user, $pass, $dbname, $port)
or die('Error connecting to MySQL server!');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $uid = mysqli_real_escape_string($conn, $input['uid']);
    $title = mysqli_real_escape_string($conn, $input['title']);
    $city = mysqli_real_escape_string($conn, $input['city']);
    $state = mysqli_real_escape_string($conn, $input['state']);
    $lat = mysqli_real_escape_string($conn, $input['lat']);
    $long = mysqli_real_escape_string($conn, $input['long']);
    $tags = mysqli_real_escape_string($conn, $input['tags']);
    $desc = mysqli_real_escape_string($conn, $input['desc']);

    // Check if the state exists in the StateInfo table
    $state_check_sql = "SELECT state_code FROM StateInfo WHERE state_name = '$state'";
    $state_check_result = $conn->query($state_check_sql);

    if ($state_check_result->num_rows > 0) {
        $state_info = $state_check_result->fetch_assoc();
        $state_code = $state_info['state_code'];

        // Insert into FuturePlans
        $insert_plan_query = "
        INSERT INTO FuturePlans (UID, title, city, state_code, tags, `desc`)
        VALUES ('$uid', '$title', '$city', '$state_code', '$tags', '$desc')";
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid state name']);
        exit();
    }
    
    if ($conn->query($insert_plan_query) === TRUE) {
        $plan_id = $conn->insert_id;

        // Insert into LocationCoordinates
        $insert_location_query = "
        INSERT INTO LocationCoordinates (planID, lat, `long`)
        VALUES ('$plan_id', '$lat', '$long')";
        
        if ($conn->query($insert_location_query) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Plan created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error inserting location: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error inserting plan: ' . $conn->error]);
    }

    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

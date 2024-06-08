<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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
    // Retrieve data from the POST request
    $uid = mysqli_real_escape_string($conn, $_POST['uid']);
    $bio = mysqli_real_escape_string($conn, $_POST['bio']);
    $city = mysqli_real_escape_string($conn, $_POST['city']);
    $state = mysqli_real_escape_string($conn, $_POST['state']);

    // Check if the state exists in the StateInfo table
    $state_check_sql = "SELECT state_code FROM StateInfo WHERE state_name = '$state'";
    $state_check_result = $conn->query($state_check_sql);

    if ($state_check_result->num_rows > 0) {
        $state_info = $state_check_result->fetch_assoc();
        $state_code = $state_info['state_code'];

        // Check if the user information already exists
        $check_sql = "SELECT * FROM UserInformation WHERE UID = '$uid'";
        $check_result = $conn->query($check_sql);

        if ($check_result->num_rows > 0) {
            // Update existing user information
            $update_sql = "UPDATE UserInformation SET bio = '$bio', city = '$city', state_code = '$state_code' WHERE UID = '$uid'";
        } else {
            // Insert new user information
            $insert_sql = "INSERT INTO UserInformation (UID, bio, city, state_code) VALUES ('$uid', '$bio', '$city', '$state_code')";
        }

        if ($conn->query($check_result->num_rows > 0 ? $update_sql : $insert_sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'User profile updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating user profile: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid state name']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
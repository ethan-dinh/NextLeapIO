<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

include('login_info.txt');

$conn = mysqli_connect($server, $user, $pass, $dbname, $port);
if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]));
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    $fname = mysqli_real_escape_string($conn, $_POST['firstName']);
    $lname = mysqli_real_escape_string($conn, $_POST['lastName']);

    // Start a transaction
    $conn->begin_transaction();

    try {
        // Insert into UserLogin table
        $sql1 = "INSERT INTO UserLogin (Email, Password, fname, lname) VALUES ('$email', '$password', '$fname', '$lname')";
        if ($conn->query($sql1) === TRUE) {
            $uid = $conn->insert_id;  // Get the last inserted UID

            // Insert into UserInformation table
            $defaultBio = "Welcome to NextLeap! This is your personal space to share and discover exciting travel plans and destinations with your friends. Use this bio to tell others about your favorite travel experiences, the places you dream of visiting, and any interesting travel tips you might have. Connect with your friends and see where their journeys are taking them, plan trips together, and make the most of your travel adventures. We are thrilled to have you on board and can't wait to see where your travels will take you next. Happy exploring!";
            $defaultBio = mysqli_real_escape_string($conn, $defaultBio);
            $defaultCity = 'Portland';
            $defaultStateCode = 'OR';
            $sql2 = "INSERT INTO UserInformation (uid, bio, city, state_code) VALUES ('$uid', '$defaultBio', '$defaultCity', '$defaultStateCode')";
            if ($conn->query($sql2) === TRUE) {
                // Commit the transaction
                $conn->commit();
                echo json_encode(['success' => true, 'message' => 'User created successfully!', 'uid' => $uid]);
            } else {
                throw new Exception('Error: ' . $conn->error);
            }
        } else {
            if ($conn->errno === 1062) {
                throw new Exception('Error: Duplicate entry. This email is already registered.');
            } else {
                throw new Exception('Error: ' . $conn->error);
            }
        }
    } catch (Exception $e) {
        // Rollback the transaction in case of error
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

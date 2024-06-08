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

    $sql = "INSERT INTO UserLogin (Email, Password, fname, lname) VALUES ('$email', '$password', '$fname', '$lname')";

    if ($conn->query($sql) === TRUE) {
        $uid = $conn->insert_id;  // Get the last inserted UID
        echo json_encode(['success' => true, 'message' => 'User created successfully!', 'uid' => $uid]);
    } else {
        if ($conn->errno === 1062) {
            // Duplicate entry error
            echo json_encode(['success' => false, 'message' => 'Error: Duplicate entry. This email is already registered.']);
        } else {
            // Other errors
            echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

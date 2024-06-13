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
    // Retrieve data from POST request
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    // Query to check if the user exists
    $sql = "SELECT UID, Password FROM UserLogin WHERE Email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['Password'] === $password) {

            // Fetch Profile Picture Path
            $uid = $row['UID'];
            $path_sql = "SELECT profile_pic_path FROM UserInformation WHERE UID = '$uid'";
            $path_result = $conn->query($path_sql);

            if ($path_result->num_rows > 0) {
                $info = $path_result->fetch_assoc();
                echo json_encode(['success' => true, 'uid' => $uid, 'profile_pic_path' => $info['profile_pic_path']]);
            } else {
                echo json_encode(['success' => true, 'uid' => $uid, 'profile_pic_path' => '']);
            }

        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

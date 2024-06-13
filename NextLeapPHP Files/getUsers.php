<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include database login info
include('login_info.txt');

// Create a connection to the database
$conn = mysqli_connect($server, $user, $pass, $dbname, $port)
or die('Error connecting to MySQL server!');

$query = "SELECT uid, fname, lname FROM UserLogin";
$result = $conn->query($query);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Error retrieving users: ' . $conn->error]);
    $conn->close();
    exit();
}

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(['success' => true, 'users' => $users]);

$conn->close();
?>

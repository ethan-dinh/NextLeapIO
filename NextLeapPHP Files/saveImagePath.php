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

$requestData = json_decode(file_get_contents('php://input'), true);

$requestType = $requestData['requestType'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $requestType) {
    if ($requestType === 'saveImagePath') {
        $uid = mysqli_real_escape_string($conn, $requestData['uid']);
        $imagePath = mysqli_real_escape_string($conn, $requestData['imagePath']);
        $fileType = mysqli_real_escape_string($conn, $requestData['fileType']);

        if($fileType === 'avatar') {
            $colName = 'profile_pic_path';
        } elseif($fileType === 'banner') {
            $colName = 'profile_banner_path';
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid file type']);
            exit();
        }

        // Update the user's image path in the database
        $update_image_path_query = "
            UPDATE UserInformation 
            SET `$colName` = '$imagePath' 
            WHERE uid = '$uid'
        ";

        if ($conn->query($update_image_path_query) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Image path updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update image path', 'error' => $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request type']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

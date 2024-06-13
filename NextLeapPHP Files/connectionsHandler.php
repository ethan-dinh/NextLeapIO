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
    if ($requestType === 'getConnections') {
        $userUID = mysqli_real_escape_string($conn, $requestData['userUID']);

        // Retrieve connections for the user
        $get_connections_query = "
            SELECT 
                u.uid AS uid, 
                CONCAT(u.fname, ' ', u.lname) AS name,
                city, state_code, profile_pic_path
            FROM 
                Friends f
            JOIN 
                UserLogin u ON (f.user1 = u.uid OR f.user2 = u.uid)
            JOIN
                UserInformation ON u.uid = UserInformation.uid
            WHERE 
                (f.user1 = '$userUID' OR f.user2 = '$userUID') AND u.uid != '$userUID'
        ";
        
        $result = $conn->query($get_connections_query);

        $connections = [];
        while ($row = $result->fetch_assoc()) {
            $connections[] = $row;
        }

        echo json_encode(['success' => true, 'connections' => $connections]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request type']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

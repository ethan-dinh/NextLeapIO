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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Retrieve UID from the GET request
    $uid = mysqli_real_escape_string($conn, $_GET['uid']);

    // Fetch user information
    $user_sql = "SELECT Email, fname, lname FROM UserLogin WHERE UID = '$uid'";
    $user_result = $conn->query($user_sql);

    if ($user_result->num_rows > 0) {
        $user = $user_result->fetch_assoc();

        // Fetch user bio and location
        $info_sql = "SELECT bio, city, state_code FROM UserInformation WHERE UID = '$uid'";
        $info_result = $conn->query($info_sql);
        $info = ($info_result->num_rows > 0) ? $info_result->fetch_assoc() : ['bio' => '', 'city' => '', 'state_code' => ''];

        // Fetch state name
        $state_sql = "SELECT state_name FROM StateInfo WHERE state_code = '{$info['state_code']}'";
        $state_result = $conn->query($state_sql);
        $state = ($state_result->num_rows > 0) ? $state_result->fetch_assoc() : ['state_name' => ''];

        // Fetch future plans
        $plans_sql = "SELECT planID, title, state_code, city, tags, `desc` FROM FuturePlans WHERE UID = '$uid'";
        $plans_result = $conn->query($plans_sql);

        $plans = [];
        while($plan = $plans_result->fetch_assoc()) {
            $plans[] = $plan;
        }

        $response = [
            'success' => true,
            'userInfo' => [
                'first_name' => $user['fname'],
                'last_name' => $user['lname'],
                'email' => $user['Email'],
                'bio' => $info['bio'],
                'current_city' => $info['city'],
                'current_state' => $state['state_name'],
            ],
            'futurePlans' => $plans
        ];
        echo json_encode($response);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
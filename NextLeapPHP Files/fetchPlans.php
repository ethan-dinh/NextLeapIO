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
    // Assuming you have a user_id to retrieve the data for a specific user
    $uid = mysqli_real_escape_string($conn, $_GET['uid']);

    // Query to retrieve future plans
    $plans_query = "
    SELECT 
        FP.planID, 
        FP.title, 
        FP.city, 
        SI.state_name as state, 
        LC.lat, 
        LC.long, 
        FP.tags, 
        FP.desc
    FROM 
        FuturePlans FP
    JOIN 
        LocationCoordinates LC USING(planID)
    JOIN
        StateInfo SI ON FP.state_code = SI.state_code
    WHERE 
        FP.UID = '$uid'";

    // Prepare the statement
    $plans_results = $conn->query($plans_query);

    // Process future plans
    $future_plans = [];
    foreach ($plans_results as $plan) {
        $future_plans[] = [
            'planID' => $plan['planID'],
            'title' => $plan['title'],
            'city' => $plan['city'],
            'state' => $plan['state'],
            'lat' => $plan['lat'],
            'long' => $plan['long'],
            'tags' => $plan['tags'],
            'desc' => $plan['desc']
        ];
    }

    // Prepare the response body
    $response_body = [
        'futurePlans' => $future_plans
    ];

    // Return the response as JSON
    echo json_encode($response_body);

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

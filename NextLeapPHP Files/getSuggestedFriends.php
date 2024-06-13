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

// Function to log debug messages
function debug_log($message) {
    error_log($message, 3, 'debug.log');
}

$requestData = json_decode(file_get_contents('php://input'), true);
$uid = mysqli_real_escape_string($conn, $requestData['uid']);
debug_log("Received request for UID: $uid\n");

// Fetch the current user's future plans
$userPlansQuery = "
    SELECT city as destination_city
    FROM FuturePlans
    WHERE uid = '$uid'
";
debug_log("Executing user plans query: $userPlansQuery\n");

$userPlansResult = $conn->query($userPlansQuery);
$userFutureCities = [];

if ($userPlansResult->num_rows > 0) {
    while ($row = $userPlansResult->fetch_assoc()) {
        $userFutureCities[] = $row['destination_city'];
    }
}
debug_log("User future cities: " . implode(", ", $userFutureCities) . "\n");

// Prepare the cities string for the SQL IN clause
$citiesInClause = "'" . implode("','", $userFutureCities) . "'";
debug_log("Cities IN clause: $citiesInClause\n");

// Fetch friends of friends who have future plans to the same cities
$query = "
    SELECT DISTINCT ul.uid, ul.fname, ul.lname, ui.profile_pic_path, fp2.city as destination_city,
           middle_ul.uid as middle_uid, middle_ul.fname as middle_fname, middle_ul.lname as middle_lname
    FROM Friends f1
    JOIN Friends f2 ON (f1.user1 = f2.user1 OR f1.user1 = f2.user2 OR f1.user2 = f2.user1 OR f1.user2 = f2.user2)
    JOIN UserLogin ul ON (f2.user1 = ul.uid OR f2.user2 = ul.uid)
    LEFT JOIN FuturePlans fp2 ON ul.uid = fp2.uid
    JOIN UserInformation ui ON ul.uid = ui.uid
    JOIN UserLogin middle_ul ON (f1.user1 = middle_ul.uid OR f1.user2 = middle_ul.uid)
    WHERE (f1.user1 = '$uid' OR f1.user2 = '$uid')
    AND ul.uid != '$uid'
    AND middle_ul.uid != '$uid'  -- Ensure the requesting user is not a middle man
    AND ul.uid NOT IN (
        SELECT DISTINCT f3.user1
        FROM Friends f3
        WHERE f3.user2 = '$uid'
        UNION
        SELECT DISTINCT f4.user2
        FROM Friends f4
        WHERE f4.user1 = '$uid'
    )
    AND fp2.city IN ($citiesInClause)
";
debug_log("Executing friends of friends query: $query\n");

$result = $conn->query($query);

$suggestedFriends = [];
$suggestedUids = [];  // Track unique UIDs
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($row['uid'] != $uid && !in_array($row['uid'], $suggestedUids)) {  // Ensure the user is not receiving a suggestion of themselves and no duplicates
            $suggestedFriends[] = $row;
            $suggestedUids[] = $row['uid'];  // Add to unique UIDs tracker
        }
    }
}
debug_log("Suggested friends: " . json_encode($suggestedFriends) . "\n");

echo json_encode(['success' => true, 'suggestedFriends' => $suggestedFriends]);

$conn->close();
?>

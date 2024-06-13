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
    if ($requestType === 'send') {
        $senderUID = mysqli_real_escape_string($conn, $requestData['senderUID']);
        $receiverUID = mysqli_real_escape_string($conn, $requestData['receiverUID']);

        // Check if the users are already friends
        $check_friends_query = "
            SELECT * FROM Friends 
            WHERE (user1 = '$senderUID' AND user2 = '$receiverUID') 
               OR (user1 = '$receiverUID' AND user2 = '$senderUID')";
        $friends_result = $conn->query($check_friends_query);

        if ($friends_result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'You are already friends.']);
        } else {
            // Check if a friend request already exists
            $check_request_query = "SELECT * FROM FriendRequests WHERE sender = '$senderUID' AND receiver = '$receiverUID'";
            $result = $conn->query($check_request_query);

            if ($result->num_rows > 0) {
                echo json_encode(['success' => false, 'message' => 'Friend request already sent.']);
            } else {
                // Insert a new friend request
                $insert_request_query = "INSERT INTO FriendRequests (sender, receiver) VALUES ('$senderUID', '$receiverUID')";
                if ($conn->query($insert_request_query) === TRUE) {
                    echo json_encode(['success' => true, 'message' => 'Friend request sent.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to send friend request: ' . $conn->error]);
                }
            }
        }
    } elseif ($requestType === 'accept') {
        $requestID = mysqli_real_escape_string($conn, $requestData['requestID']);
        $userUID = mysqli_real_escape_string($conn, $requestData['userUID']);

        // Delete the friend request
        $delete_request_query = "DELETE FROM FriendRequests WHERE sender = '$requestID'";

        // Insert a new friend relationship
        $insert_friend_query = "INSERT INTO Friends (user1, user2) VALUES ('$requestID', '$userUID')";

        if ($conn->query($delete_request_query) === TRUE) {
            if ($conn->query($insert_friend_query) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'Friend request accepted.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to accept friend request: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to accept friend request: ' . $conn->error]);
        }
    } elseif ($requestType === 'decline') {
        $requestID = mysqli_real_escape_string($conn, $requestData['requestID']);
        $userUID = mysqli_real_escape_string($conn, $requestData['userUID']);

        // Delete the friend request
        $delete_request_query = "DELETE FROM FriendRequests WHERE sender = '$requestID' AND receiver = '$userUID'";

        if ($conn->query($delete_request_query) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Friend request declined.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to decline friend request: ' . $conn->error]);
        }
    } elseif ($requestType === 'getRequests') {
        $userUID = mysqli_real_escape_string($conn, $requestData['userUID']);

        // Retrieve friend requests for the user
        $get_requests_query = "
            SELECT receiver, sender, city, state_code, CONCAT(UserLogin.fname, ' ', UserLogin.lname) AS senderName, profile_pic_path
            FROM FriendRequests
            JOIN UserLogin ON FriendRequests.sender = UserLogin.uid
            JOIN UserInformation ON UserLogin.uid = UserInformation.uid
            WHERE receiver = '$userUID'";
        $result = $conn->query($get_requests_query);

        $friendRequests = [];
        while ($row = $result->fetch_assoc()) {
            $friendRequests[] = $row;
        }

        echo json_encode(['success' => true, 'friendRequests' => $friendRequests]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request type']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>

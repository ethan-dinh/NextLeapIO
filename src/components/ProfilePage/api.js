import AWS from "aws-sdk";

const testProfile = {
  name: "TEST",
  email: "TEST@gmail.com",
  about: "TEST",
  location: "TEST, TEST",
};

const s3 = new AWS.S3({
  accessKeyId: "AKIAQXBYNAKY5KTU5DQJ",
  secretAccessKey: "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",
  region: "us-west-2"
});

export const uploadImage = async (userId, editor) => {
  if (!editor) return;

  // Get the canvas image blob
  const canvas = editor.getImage().toDataURL();
  const blob = await fetch(canvas).then(res => res.blob());

  // Define the S3 parameters for the new image
  const key = `${userId}_${Date.now()}.png`;
  const params = {
    Bucket: 'nextleapimageupload',
    Key: key,
    Body: blob,
    ContentType: 'image/png',
  };

  try {
    // Delete old images
    await deleteOldImages(userId);

    // Upload the new image to S3
    const data = await s3.upload(params).promise();
    const imagePath = data.Location;

    // Save the new image path to the database
    await saveImagePath(userId, imagePath);
    return imagePath;

  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

const deleteOldImages = async (userId) => {
  try {
    const listParams = {
      Bucket: 'nextleapimageupload',
      Prefix: `${userId}_`,
    };

    // List all objects in the bucket for the user
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: 'nextleapimageupload',
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    // Delete all listed objects
    await s3.deleteObjects(deleteParams).promise();
  } catch (error) {
    console.error('Error deleting old images:', error);
    throw new Error('Failed to delete old images');
  }
};

async function saveImagePath(uid, imagePath) {
  const url = `https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/saveImagePath.php`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requestType: "saveImagePath",
      uid,
      imagePath,
    }),
  });

  return response.json();
}

export async function fetchUserProfile(uid) {
  const userInfoUrl = `https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/fetchUserProfile.php?uid=${uid}`;
  const userPlansUrl = `https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/fetchPlans.php?uid=${uid}`;

  try {
    // Fetch user info
    const userInfoResponse = await fetch(userInfoUrl);
    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user information: " + userInfoResponse.status);
    }
    const userInfoData = await userInfoResponse.json();
    const profileInfo = userInfoData.userInfo;

    // Fetch user plans
    const userPlansResponse = await fetch(userPlansUrl);
    if (!userPlansResponse.ok) {
      throw new Error("Failed to fetch user plans: " + userPlansResponse.status);
    }
    const userPlansData = await userPlansResponse.json();
    const futurePlans = userPlansData.futurePlans;

    return {
      name: `${profileInfo.first_name} ${profileInfo.last_name}`,
      email: profileInfo.email,
      about: profileInfo.bio.trim(),
      location: `${profileInfo.current_city}, ${profileInfo.current_state}`,
      plans: futurePlans,
      profilePicPath: profileInfo.profilePath,
    };
  } catch (error) {
    console.error("Error:", error);
    return testProfile; // Fall back to testProfile in case of an error
  }
}

export async function updateUserProfile(uid, bio, city, state) {
  const url = `https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/updateUserProfile.php`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ uid, bio, city, state }).toString(),
  });

  return response.json();
}

export async function createPost(newPlan) {
  try {
    const response = await fetch('https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/createPost.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPlan)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  }
}

export async function deletePlan(planID) {
  console.log('Deleting plan:', planID);
  try {
    const response = await fetch(`https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/deletePlan.php?planID=${planID}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  }
}

export async function sendFriendRequest(loggedInUid, userProfileUid) {
  try {
    const response = await fetch('https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/friendRequestHandler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'send',
        senderUID: loggedInUid,
        receiverUID: userProfileUid,
      }),
    });

    const data = await response.json();

    // Notify the user
    if (data.success) {
      console.log('Friend request sent:', data.message);
      return data;
    } else {
      throw new Error('Failed to send friend request: ' + data.message);
      return data;
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  }
}

export async function fetchFriendRequests(uid) {
  try {
    const response = await fetch("https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/friendRequestHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "getRequests",
        userUID: uid,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return data.friendRequests;
    } else {
      throw new Error("Failed to fetch friend requests: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function acceptFriendRequest(uid, requestID) {
  try {
    const response = await fetch("https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/friendRequestHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "accept",
        requestID: requestID,
        userUID: uid,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      throw new Error("Failed to accept friend request: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function declineFriendRequest(uid, requestID) {
  try {
    const response = await fetch("https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/friendRequestHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "decline",
        requestID: requestID,
        userUID: uid,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      throw new Error("Failed to decline friend request: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function fetchConnections(uid) {
  try {
    const response = await fetch("https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/connectionsHandler.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "getConnections",
        userUID: uid,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return data.connections;
    } else {
      throw new Error("Failed to fetch connections: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
import React, { useState } from "react";
import banner from "./images/banner-default.jpg";
import avatar from "./images/default-avatar.png";
import Dropzone from "react-dropzone";
import { sendFriendRequest } from './api';
import AvatarEditorPopup from './AvatarEditorPopup';

function GeneralInfoCard({ userProfile, handleEditClick, loggedInUid, handleTabClick, activeTab, updateProfilePicture }) {

  console.log('GeneralInfoCard:', userProfile.profilePicPath);

  const [file, setFile] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  const handleDrop = (dropped) => {
    setFile(dropped[0]);
  };

  const handleSendFriendRequest = async () => {
    const response = await sendFriendRequest(loggedInUid, userProfile.uid);
    console.log(response);
    if (response.success) {
      setFriendRequestSent(true);
    } else {
      alert(response.message);
    }
  };

  const handleProfilePictureUpdate = (newProfilePicPath) => {
    console.log('Updating profile picture:', newProfilePicPath);
    updateProfilePicture(newProfilePicPath);
    setFile(null);
  };

  return (
    <div className="profile-card top">
      <div className="profile-banner">
        <img src={banner} alt="Banner" className="banner-picture" />
      </div>
      <div className="profile-content">
        <div className="profile-image-section">
          {loggedInUid === userProfile.uid ? (
            <Dropzone onDrop={handleDrop} multiple={false} accept={{ 'image/*': [] }}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="upload-container">
                  <input {...getInputProps()} />
                  <img 
                    src={userProfile.profilePicPath ? userProfile.profilePicPath : avatar} alt="Avatar" 
                    className="profile-picture" 
                  />
                  {userProfile.profilePicPath ? <div className="change-picture-text">Change Picture</div> : <div className="upload-text">Upload Picture</div>}
                </div>
              )}
            </Dropzone>
          ) : (
            <img src={userProfile.profilePicPath ? userProfile.profilePicPath : avatar} alt="Avatar" className="avatar-picture" />
          )}
        </div>

        <div className="profile-text">
          <div className="profile-name">{userProfile.name}</div>
          <div className="profile-email">{userProfile.email}</div>
        </div> 

        {loggedInUid !== userProfile.uid && (
          friendRequestSent ? (
            <button className="sent-request modern-button" disabled>Sent Request</button>
          ) : (
            <button className="add-friend modern-button" onClick={handleSendFriendRequest}>Connect</button>
          )
        )}

        {loggedInUid === userProfile.uid && (
          <button className="edit modern-button" onClick={handleEditClick}>Edit Profile</button>
        )}
      </div>

      <div className="profile-tabs">
        <button
          className={activeTab === "about" ? "active" : ""}
          onClick={() => handleTabClick("about")}
        >
          About
        </button>
        <button
          className={activeTab === "future-plans" ? "active" : ""}
          onClick={() => handleTabClick("future-plans")}
        >
          Future Plans
        </button>
      </div>

      {file && (
        <AvatarEditorPopup
          file={file}
          userProfileUid={userProfile.uid}
          onClose={() => setFile(null)}
          onSave={handleProfilePictureUpdate}
        />
      )}
    </div>
  );
}

export default GeneralInfoCard;

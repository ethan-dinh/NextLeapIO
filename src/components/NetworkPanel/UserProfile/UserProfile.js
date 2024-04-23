import React from 'react';
import './UserProfile.css'; // A separate CSS file for styling the profile card
import avatar from '../images/headshot.png'; // Import the image like this
import background from '../images/background.png'; // Import the background image

function UserProfileCard() {
    // Placeholder data - replace with actual data later
    const user = {
      name: 'Julie Smith',
      occupation: 'Web Developer',
      followers: 6589,
      following: 721,
      bio: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.'
    };

    return (
      <div className="user-profile-card">
        <div className="profile-background" style={{ backgroundImage: `url(${background})` }}>
          <div className="profile-avatar-container">
            <img src={avatar} alt={`${user.name}`} className="profile-avatar" />
          </div>
        </div>
        <h3 className="user-name">{user.name}</h3>
        <p className="occupation">{user.occupation}</p>
        <div className="profile-stats">
          <span>{user.followers} Followers</span>
          <span>{user.following} Following</span>
        </div>
        <button className="follow-btn">Edit Profile</button>
        <p className="profile-bio">{user.bio}</p>
      </div>
    );
}
  
export default UserProfileCard;
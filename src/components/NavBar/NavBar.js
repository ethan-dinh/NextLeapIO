import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './NavBar.css';

// Importing Icon Images
// import LogoIcon from './icons/LOGO.png';
import NotificationIcon from './icons/notification.png';
// import SettingsIcon from './icons/settings.png';
import UserIcon from './icons/user-2.jpg';
import HomeIcon from './icons/home.png';

function NavBar() {
  const navigate = useNavigate(); // useNavigate for navigation

  const handleIconClick = (path) => {
    // Use navigate to change the route
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="logo">  
          <div className="logo-text">NEXTLEAP.IO</div> 
      </div>
      <div className="interaction-field">
        <div className="search-bar">
          <input type="text" placeholder="Start typing to search..." />
        </div>
        <div className="nav-icons">
          <button onClick={() => handleIconClick('/')} aria-label="Home">
            <img src={HomeIcon} alt="Home" />
          </button>
          <button onClick={() => handleIconClick('/notifications')} aria-label="Notifications">
            <img src={NotificationIcon} alt="Notifications" />
          </button>
          <button onClick={() => handleIconClick('/profile')} className="profile-pic" aria-label="Profile">
            <img src={UserIcon} alt="Profile" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

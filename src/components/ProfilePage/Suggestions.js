import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { fetchSuggestedFriends } from './api'; // Import the new function
import './CSS/Suggestions.css';

import Avatar from "./images/default-avatar.png";

function SuggestionPanel() {
  const { user } = useContext(UserContext);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleUserClick = (uid) => {
    navigate(`/profile?uid=${uid}`);
  };

  useEffect(() => {
    if (user) {
      fetchSuggestedFriends(user.uid)
        .then((data) => {
          if (data.success) {
            setSuggestedFriends(data.suggestedFriends);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching suggested friends:', error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <div className="suggestion-panel"></div>;
  }

  return (
    <div className="suggestion-panel">
      <div className="friend-requests card">
        <h4>Suggested Friends</h4>
        {suggestedFriends.length > 0 ? (
          <ul>
            {suggestedFriends.map((suggestion) => (
              <li key={suggestion.uid} className="friend-request-item">
                <div className="profile-name" onClick={() => handleUserClick(suggestion.uid)}>
                  <img src={suggestion.profile_pic_path ? suggestion.profile_pic_path : Avatar} alt="Profile" id="request-img"/>
                  <div className="request-info">
                    <h4> {suggestion.fname} {suggestion.lname} | {suggestion.destination_city} </h4>
                    <p> {suggestion.fname} is a mutual of {suggestion.middle_fname} {suggestion.middle_lname} </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No suggested friends found.</p>
        )}
      </div>
    </div>
  );
}

export default SuggestionPanel;

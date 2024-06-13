import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./CSS/FriendRequests.css";
import { fetchFriendRequests, acceptFriendRequest, declineFriendRequest } from "./api";

import noIcon from "./icons/no.png";
import yesIcon from "./icons/yes.png";
import Avatar from "./images/default-avatar.png";

const FriendRequests = ({ onAccept }) => {
  const { user } = useContext(UserContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (user) {
          const requests = await fetchFriendRequests(user.uid);
          setFriendRequests(requests);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const handleAcceptRequest = async (requestID) => {
    try {
      await acceptFriendRequest(user.uid, requestID);
      setFriendRequests(friendRequests.filter(request => request.sender !== requestID));
      onAccept(); // Trigger reload of connections
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestID) => {
    try {
      await declineFriendRequest(user.uid, requestID);
      setFriendRequests(friendRequests.filter(request => request.sender !== requestID));
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const handleUserClick = (uid) => {
    navigate(`/profile?uid=${uid}`);
  };

  return (
    <div className="friend-requests card">
      <h4>Friend Requests</h4>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        friendRequests.length > 0 ? (
          <ul>
            {friendRequests.map((request) => (
              <li key={request.sender} className="friend-request-item">
                <div className="profile-name" onClick={() => handleUserClick(request.sender)}>
                  <img src={request.profile_pic_path ? request.profile_pic_path : Avatar} alt="Profile" id="request-img"/>
                  <div className="request-info">
                    <h4> {request.senderName} </h4>
                    <p> {request.city}, {request.state_code} </p>
                  </div>
                </div>
                <div className="accept-decline-buttons">
                  <button
                    onClick={() => handleAcceptRequest(request.sender)}
                    aria-label="accept-friend-request"
                    className="modern-button request-button"
                    id="accept-friend-request"
                  >
                    <span className="button-text">Accept</span>
                    <img src={yesIcon} alt="accept" id="icon-accept" />
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.sender)}
                    aria-label="decline-friend-request"
                    className="modern-button request-button"
                    id="decline-friend-request"
                  >
                    <span className="button-text">Decline</span>
                    <img src={noIcon} alt="decline" id="icon-decline" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No friend requests</p>
        )
      )}
    </div>
  );
};

export default FriendRequests;

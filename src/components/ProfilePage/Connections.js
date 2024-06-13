import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Connections.css";
import Avatar from "./images/default-avatar.png";
import { fetchConnections } from "./api"; 

const Connections = ({ userProfile, reloadConnections }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = userProfile;

  useEffect(() => {
    const fetchUserConnections = async () => {
      try {
        if (user) {
          const connectionsList = await fetchConnections(user.uid);
          setConnections(connectionsList);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserConnections();
  }, [user, reloadConnections]);

  const handleUserClick = (uid) => {
    navigate(`/profile?uid=${uid}`);
  };

  return (
    <div className="connections card">
      <h4>{user.name.split(" ")[0]}'s Connections</h4>
      <div className="connections-divider">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          connections.length > 0 ? (
            <ul>
              {connections.map((connection) => (
                <li key={connection.uid} className="friend-request-item">
                  <div className="profile-name" onClick={() => handleUserClick(connection.uid)}>
                    <img src={connection.profile_pic_path ? connection.profile_pic_path : Avatar} alt="Profile" id="request-img"/>
                    <div className="request-info">
                      <h4> {connection.name} </h4>
                      {connection.city && connection.state_code ? (
                        <p> {connection.city}, {connection.state_code} </p>
                      ) : (
                        <p> N/A </p>
                      )}
                    </div>
                  </div>
                  
                </li>
              ))}
            </ul>
          ) : (
            <p>No connections</p>
          )
        )}
      </div>
    </div>
  );
};

export default Connections;

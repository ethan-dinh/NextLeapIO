import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./CSS/ProfilePage.css";
import "./CSS/CreatePost.css";

import ProfilePanel from "./ProfilePanel";
import FriendRequests from "./FriendRequests";
import Connections from "./Connections"; 
import SuggestionPanel from "./Suggestions"; // Import the SuggestionPanel component
import { fetchUserProfile } from "./api"; 

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiZGluaGUiLCJhIjoiY2xwMTBnYnZrMGQ2aDJrczVtb2FrYnJ3dSJ9.h0tUpCSX9MvaA-NirwN4rQ";

function ProfilePage() {
  const { user } = useContext(UserContext); 

  const { search } = useLocation(); 
  const params = new URLSearchParams(search);
  const uid = params.get("uid"); 

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const [reloadConnections, setReloadConnections] = useState(false); // State to trigger reload

  useEffect(() => {
    if (uid) {
      setUserProfile(null); // Clear previous user profile
      setLoading(true); // Set loading to true while fetching new data
      setOpacity(0); // Reset opacity

      fetchUserProfile(uid).then((profile) => {
        setUserProfile({ ...profile, uid });
        setLoading(false);
        setTimeout(() => setOpacity(1), 100);
      });
    }
  }, [uid]);

  return (
    <div style={{ display: "flex", overflow: "hidden", height: "100%" }}>
      {loading && (
        <div className="loading-background">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && (
        <div className="profile-page" style={{ opacity: opacity }}>
          {user?.uid === userProfile?.uid ? (
            <SuggestionPanel />
          ) : (
            <div className="left"></div>
          )}
          <ProfilePanel userProfile={userProfile} loggedInUid={user?.uid} setUserProfile={setUserProfile} />
          {user?.uid === userProfile?.uid ? (
            <div className="right">
              <FriendRequests onAccept={() => setReloadConnections(!reloadConnections)} />
              <Connections userProfile={userProfile} reloadConnections={reloadConnections} />
            </div>
          ) : (
            <div className="right">
              <Connections userProfile={userProfile} reloadConnections={reloadConnections} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

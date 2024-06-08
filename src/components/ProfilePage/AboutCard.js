import React, { useState, useEffect } from "react";
import { updateUserProfile } from "./api";

function AboutCard({ userProfile, setUserProfile, editMode, setEditMode, activeTab }) {
  const [bio, setBio] = useState(userProfile.about);
  const [city, setCity] = useState(userProfile.location.split(", ")[0]);
  const [state, setState] = useState(userProfile.location.split(", ")[1]);

  useEffect(() => {
    if (!editMode) {
      setBio(userProfile.about);
      setCity(userProfile.location.split(", ")[0]);
      setState(userProfile.location.split(", ")[1]);
    }
  }, [editMode, userProfile]);

  const handleSaveClick = async () => {
    try {
      const response = await updateUserProfile(userProfile.uid, bio, city, state);
      if (response.success) {
        setUserProfile({
          ...userProfile,
          about: bio,
          location: `${city}, ${state}`,
        });
        setEditMode(false);
      } else {
        console.error("Error updating profile:", response.message);
        alert("Failed to update profile: " + response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update profile. Please try again later.");
    }
  };

  return (
    <div className={`left-col ${activeTab === "future-plans" ? "shrink" : ""}`}>
      <div className="profile-card">
        {editMode ? (
          <>
            <div className="profile-details bottom-border">
              <h4>About</h4>
              <textarea value={bio} className="about-edit" onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="profile-settings">
              <h4>Private</h4>
              <p className="bot-margin">
                Your information is only seen by your first connections
              </p>
              {/* ... */}

              <h4>Visible</h4>
              <p className="bot-margin">Anyone can find you!</p>
              {/* ... */}
              <h4>Location</h4>

              <div className="location-edit">
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                <input type="text" value={state} id="state-input" onChange={(e) => setState(e.target.value)} />
              </div>

              <button className="modern-button about-button" onClick={handleSaveClick}>Confirm</button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-details bottom-border">
              <h4>About</h4>
              <p className="profile-about">{userProfile.about}</p>
            </div>

            <div className="profile-settings">
              <h4>Private</h4>
              <p className="bot-margin">
                Your information is only seen by your first connections
              </p>
              {/* ... */}

              <h4>Visible</h4>
              <p className="bot-margin">Anyone can find you!</p>
              {/* ... */}
              <h4>Location</h4>
              <p className="profile-location">{userProfile.location}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AboutCard;

import React, { useState } from "react";
import GeneralInfoCard from "./GeneralInfoCard";
import AboutCard from "./AboutCard";
import { PlanWithMap, CreatePost } from "./UserPlans";

function ProfilePanel({ userProfile, setUserProfile, loggedInUid }) {
  const [plans, setPlans] = useState(userProfile.plans || []);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const handleAddPlan = (newPlan) => {
    setPlans((prevPlans) => [...prevPlans, newPlan]);
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDeletePlan = (planID) => {
    setPlans(plans.filter(plan => plan.planID !== planID));
  };

  const updateProfilePicture = (newProfilePicPath) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      profilePicPath: newProfilePicPath,
    }));
  };

  return (
    <div className="profile-panel">
      <GeneralInfoCard
        userProfile={userProfile}
        loggedInUid={loggedInUid}
        handleEditClick={handleEditClick}
        handleTabClick={handleTabClick}
        activeTab={activeTab}
        updateProfilePicture={updateProfilePicture}
      />
      <div className="row-flex">
        <AboutCard
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          editMode={editMode}
          setEditMode={setEditMode}
          activeTab={activeTab}
        />
        <div className="right-col" id="FuturePlans">
          <CreatePost addNewPlan={handleAddPlan} loggedInUid={loggedInUid} userProfile={userProfile}/>
          {plans.map((plan) => (
            <PlanWithMap key={plan.planID} plan={plan} activeTab={activeTab} onDelete={handleDeletePlan} loggedInUid={loggedInUid} userProfile={userProfile}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePanel;

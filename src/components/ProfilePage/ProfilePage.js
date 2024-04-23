import React, { useState, useEffect} from 'react';
import './ProfilePage.css';
import './CreatePost.css';

import {PlanWithMap, CreatePost} from './UserPlans';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import banner from './banner.JPG';
import avatar from './headshot.jpg';

const uid = 1; // Assuming the UID is hardcoded to 1 for this example

// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaGUiLCJhIjoiY2xwMTBnYnZrMGQ2aDJrczVtb2FrYnJ3dSJ9.h0tUpCSX9MvaA-NirwN4rQ';

const testProfile = {
    name: "TEST",
    email: "TEST@gmail.com",
    about: "TEST",
    location: "TEST, TEST",
};

async function fetchUserProfile() {
    const url = `https://syd9pnu2hb.execute-api.us-west-2.amazonaws.com/default/retrieveUserInfo?uid=${uid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch user information: ' + response.status);
        }

        const data = await response.json();
        const profileInfo = data.userInfo

        return {
            name: `${profileInfo.first_name} ${profileInfo.last_name}`,
            email: profileInfo.email,
            about: profileInfo.bio.trim(),
            location: `${profileInfo.current_city}, ${profileInfo.current_state}`,
            plans: data.futurePlans
        };
    } catch (error) {
        console.error('Error:', error);
        return testProfile; // Fall back to testProfile in case of an error
    }
}

function GeneralInfoCard({userProfile}) {
    return (
        <div className="profile-card top">
            <div className="profile-banner">
                <img src={banner} alt="Banner" className="banner-picture" />
            </div>            
            <div className="profile-content">                
                <div className="profile-image-section">
                    <img src={avatar} alt={userProfile.name} className="profile-picture" />
                </div>
                <div className="profile-text">
                    <div className="profile-name">{userProfile.name}</div>
                    <div className="profile-email">{userProfile.email}</div>
                </div>                
                <button className="add-friend button">ADD FRIEND</button>
                <button className="message button">MESSAGE</button>
                <button className="more button">MORE</button>
            </div>
            <div className="profile-tabs">
                <button className="active">About</button>
                <button>Future Plans</button>
                <button>Discussion</button>
            </div>
        </div>
    );
}

function AboutCard({userProfile}) {
    return (
        <div className="left-col">
            <div className="profile-card">
                <div className="profile-details bottom-border">
                    <h4>About</h4>
                    <p className="profile-about">{userProfile ? userProfile.about : 'Loading...'}</p>
                </div>

                <div className="profile-settings">
                    <h4>Private</h4>
                    <p className="bot-margin">Your information is only seen by your first connections</p>
                    {/* ... */}

                    <h4>Visible</h4>
                    <p className="bot-margin">Anyone can find you!</p>
                    {/* ... */}

                    <h4>Location</h4>
                    <p className="no-margin">{userProfile ? userProfile.location : 'Loading...'}</p>
                    {/* ... */}
                </div>
            </div>
        </div>
    );
}

function ProfilePanel({ userProfile }) {
    const [plans, setPlans] = useState(userProfile.plans || []);
    const handleAddPlan = (newPlan) => {
        setPlans(prevPlans => [...prevPlans, newPlan]);
    };

    return (
        <div className="profile-panel">
            <GeneralInfoCard userProfile={userProfile} />
            <div className="row-flex">
                <AboutCard userProfile={userProfile} />
                <div className="right-col" id="FuturePlans">
                    <CreatePost addNewPlan={handleAddPlan} />
                    {plans.map(plan => <PlanWithMap key={plan.planID} plan={plan} />)}
                </div>
            </div>
        </div> 
    );
}

function ProfilePage() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        fetchUserProfile().then(profile => {
            setUserProfile(profile);
            setLoading(false);
            setTimeout(() => setOpacity(1), 100);
        });
    }, []);

    return (
        <div style={{display: "flex", overflow: "hidden"}}>
            {loading && (
                <div className="loading-background">
                   <div className="spinner"></div>
                </div>
            )}

            {!loading && (
                <div className="profile-page" style={{opacity: opacity}}>
                    <div className="suggested-panel"></div>
                    <ProfilePanel userProfile={userProfile} />
                    <div className="connections-panel">
                        <h4>Connections</h4>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
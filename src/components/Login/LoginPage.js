import React, { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

import './css/Login.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaGUiLCJhIjoiY2xwMTBnYnZrMGQ2aDJrczVtb2FrYnJ3dSJ9.h0tUpCSX9MvaA-NirwN4rQ';

function LoginPage() {
    const [formType, setFormType] = useState('login');
    const mapContainerRef = useRef(null);

    const toggleForm = (type) => {
        setFormType(type);
    };

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40],
            zoom: 9,
        });

        return () => map.remove();
    }, []);

    return (
        <div className="app-container">
            <div className="map-background" ref={mapContainerRef}></div>
            <div className="content">
                <div className="left-panel">
                    <div className="logo">
                        <h1>NextLeap</h1>
                    </div>
                </div>
                <div className="right-panel">
                    {formType === 'login' ? (
                        <LoginForm toggleForm={toggleForm} />
                    ) : (
                        <SignupForm toggleForm={toggleForm} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

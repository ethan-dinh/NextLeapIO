import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import NetworkPanel from './components/NetworkPanel/NetworkPanel';
import GeoViewPanel from './components/GeoViewPanel/GeoViewPanel';
import ProfilePage from './components/ProfilePage/ProfilePage'; // Ensure you have a ProfilePage component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={
            <div className="interaction-container">
              <div className="panel" id="networkPanel">
                <NetworkPanel />
              </div>
              <div className="panel" id="geoViewPanel">
                <GeoViewPanel />
              </div>
            </div>
          } />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

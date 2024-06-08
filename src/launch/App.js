import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from '../components/Login/LoginPage';
import NavBar from '../components/NavBar/NavBar';
import ProfilePage from '../components/ProfilePage/ProfilePage';
import { UserProvider } from '../components/context/UserContext';
import ProtectedRoute from '../components/ProtectedRoute'; // Adjust the import path as necessary

import './App.css';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute component={() => (
                                    <div className="page">
                                        <NavBar />
                                        <ProfilePage />
                                    </div>
                                )} />
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;

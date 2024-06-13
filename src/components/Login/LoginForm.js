import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { loginUser } from "./api/api";

const LoginForm = ({ toggleForm }) => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        loginUser(formData)
            .then((data) => {
                if (data.success) {
                    setTimeout(() => {
                        setLoading(false);
                        setLoginSuccess(true);

                        setUser({ uid: data.uid, profilePicPath: data.profile_pic_path });
                        setTimeout(() => {
                            navigate(`/profile?uid=${data.uid}`);
                        }, 500);
                    }, 2000); 
                } else {
                    setLoading(false);
                    if (data.errorType === "wrong_password") {
                        setError("Wrong password. Please try again.");
                    } else if (data.errorType === "email_not_found") {
                        setError("Email not found. Please sign up for a new account.");
                    } else {
                        setError("An unknown error occurred. Please try again.");
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                setError("An error occurred. Please try again.");
                console.error("Error:", error);
            });
    };

    return (
        <form id="login-form" className="form active" onSubmit={handleSubmit}>
            <h1>Welcome Back!</h1>
            <div className="desc">Find out where your friends are going with NextLeap. Get started for free.</div>
            {error && <div className="error-message">{error}</div>}
            <p className="form-info">Username</p>
            <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                required
                onChange={handleChange}
                disabled={loading}
            />
            <p className="form-info">Password</p>
            <input
                type="password"
                name="password"
                placeholder="*********"
                required
                onChange={handleChange}
                disabled={loading}
            />
            <button type="submit" disabled={loading || loginSuccess}>
                {loading ? (
                    <div className="spinner-tmp"></div>
                ) : loginSuccess ? (
                    <div className="checkmark">&#10003;</div>
                ) : (
                    "Log In"
                )}
            </button>
            <p>
                Don't have an account?{" "}
                <span onClick={() => toggleForm("signup")}>Sign Up</span>
            </p>
        </form>
    );
};

export default LoginForm;
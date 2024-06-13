import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ toggleForm }) => {
    const { setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });
    const [phase, setPhase] = useState(1);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // useNavigate for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const validatePhase1 = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Email is not valid";
        }
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validatePhase1()) {
            setFormData((prevData) => ({
                ...prevData,
                firstName: capitalizeFirstLetter(prevData.firstName),
                lastName: capitalizeFirstLetter(prevData.lastName),
            }));
            setPhase(2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
            fetch('https://ix.cs.uoregon.edu/~edinh/NextLeapAPI/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Account created:', data.message);

                    // convert data.uid to string
                    data.uid = data.uid.toString();

                    setUser({ uid: data.uid, profilePicPath: '' });
                    setTimeout(() => navigate(`/profile?uid=${data.uid}`), 1000);
                } else {
                    console.error('Error:', data.message);
                    alert(data.message);  
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Passwords do not match');
        }
    };

    return (
        <form id="signup-form" className="form active" onSubmit={handleSubmit}>
            <h1>Welcome to NextLeap!</h1>
            <div className="desc">We look forward to having you join our platform! Come and see where your friends are going.</div>

            {phase === 1 ? (
                <>
                    <p className="form-info">Email</p>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                    
                    <p className="form-info">First Name</p>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                    
                    <p className="form-info">Last Name</p>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                    
                    <button type="button" onClick={handleNext}>Next</button>
                </>
            ) : (
                <>
                    <p className="form-info">Password</p>
                    <input
                        type="password"
                        name="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    
                    <p className="form-info">Confirm Password</p>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    
                    <button type="submit">Sign Up</button>
                </>
            )}

            <p>
                Already have an account?{' '}
                <span onClick={() => toggleForm('login')}>Log In</span>
            </p>
        </form>
    );
};

export default SignupForm;
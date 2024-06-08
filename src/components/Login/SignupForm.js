import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ toggleForm }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });
    const [phase, setPhase] = useState(1);
    const navigate = useNavigate(); // useNavigate for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phase === 2 && formData.password === formData.confirmPassword) {
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
                    navigate(`/profile?uid=${data.uid}`); // Redirect to profile page with UID
                } else {
                    console.error('Error:', data.message);
                    alert(data.message);  // Display error message to the user
                }
            })
            .catch(error => console.error('Error:', error));
        } else if (formData.password !== formData.confirmPassword) {
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
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <p className="form-info">First Name</p>
                    <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
                    <p className="form-info">Last Name</p>
                    <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
                    <button type="button" onClick={() => setPhase(2)}>Next</button>
                </>
            ) : (
                <>
                    <p className="form-info">Password</p>
                    <input type="password" name="password" placeholder="********" value={formData.password} onChange={handleChange} required />
                    <p className="form-info">Confirm Password</p>
                    <input type="password" name="confirmPassword" placeholder="********" value={formData.confirmPassword} onChange={handleChange} required />
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

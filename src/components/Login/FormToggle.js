import React from 'react';

const FormToggle = ({ formType, toggleForm }) => {
    return (
        <div className="form-toggle">
            <button
                id="login-toggle"
                className={formType === 'login' ? 'active' : ''}
                onClick={() => toggleForm('login')}
            >
                Log In
            </button>
            <button
                id="signup-toggle"
                className={formType === 'signup' ? 'active' : ''}
                onClick={() => toggleForm('signup')}
            >
                Sign Up
            </button>
        </div>
    );
};

export default FormToggle;

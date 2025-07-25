import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../../assets/styles/pages/auth/RegisterPage.css';

const RegisterCompleted = ({ engName }) => {
  const nav = useNavigate();

  return (
    <div className="register-completed-container">
      <div className="register-completed-card">
        <FaCheckCircle className="success-icon" />
        <h1>Welcome, {engName}!</h1>
        <p>Your registration has been completed successfully.</p>
        <button className="login-button" onClick={() => nav('/')}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterCompleted;

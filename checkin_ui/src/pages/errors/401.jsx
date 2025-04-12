import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaSignInAlt, FaHome } from 'react-icons/fa';
import '../../assets/styles/pages/errors/ErrorPage.css';

const Error401 = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <FaLock />
        </div>
        <h1 className="error-code">401</h1>
        <h2 className="error-title">Unauthorized</h2>
        <p className="error-message">
          Oops! You need to log in to access this page.
        </p>
        <p className="error-description">
          Please sign in with your credentials to continue.
        </p>
        <div className="error-actions">
          <Link to="/login" className="primary-button">
            <FaSignInAlt /> Log In
          </Link>
          <Link to="/" className="secondary-button">
            <FaHome /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error401; 
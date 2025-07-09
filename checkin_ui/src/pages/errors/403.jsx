import React from 'react';
import { Link } from 'react-router-dom';
import { FaLockOpen, FaHome, FaArrowLeft } from 'react-icons/fa';
import '../../assets/styles/pages/errors/ErrorPage.css';

const Error403 = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <FaLockOpen />
        </div>
        <h1 className="error-code">403</h1>
        <h2 className="error-title">Access Forbidden</h2>
        <p className="error-message">Sorry, you don't have permission to access this page.</p>
        <p className="error-description">
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="error-actions">
          <button className="secondary-button" onClick={() => window.history.back()}>
            <FaArrowLeft /> Go Back
          </button>
          <Link to="/" className="home-button">
            <FaHome /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error403;

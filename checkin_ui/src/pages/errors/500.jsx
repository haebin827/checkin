import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import '../../assets/styles/pages/errors/ErrorPage.css';

const Error500 = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <FaExclamationTriangle />
        </div>
        <h1 className="error-code">500</h1>
        <h2 className="error-title">Server Error</h2>
        <p className="error-message">
          Oops! Something went wrong on our end. Our servers are experiencing some issues.
        </p>
        <p className="error-description">
          We're working to fix the problem. Please try again later.
        </p>
        <div className="error-actions">
          <Link to="/" className="home-button">
            <FaHome /> Return Home
          </Link>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error500;

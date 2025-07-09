import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import '../../assets/styles/pages/auth/VerifyEmailPage.css';

const FindUsernamePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const location = useLocation();
  const nav = useNavigate();

  console.log('location: ', location);
  useEffect(() => {
    fetchData();
  }, [location]);

  const fetchData = async () => {
    try {
      const token = new URLSearchParams(location.search).get('token');

      if (!token) {
        setError('Invalid token');
        setLoading(false);
        return;
      }

      const response = await AuthService.verifyUsername(token);

      if (response.data.success) {
        setUsername(response.data.username);
      } else {
        setError(response.data.message || 'Failed to verify email');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setError(error.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h1>Account ID Verification</h1>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button className="back-button" onClick={() => nav('/forgot')}>
              Back to Find Account
            </button>
          </div>
        ) : (
          <div>
            <p>Your account ID is:</p>
            <h2 className="username">{username}</h2>
            <button className="login-button" onClick={() => nav('/')}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindUsernamePage;

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import '../../assets/styles/pages/auth/VerifyEmailPage.css';
import RegisterCompleted from '../../components/forms/RegisterCompleted.jsx';
import RegisterForm from '../../components/forms/RegisterForm.jsx';
import EmailConfirmationForm from '../../components/forms/EmailConfirmationForm.jsx';
import LocationService from '../../services/LocationService.js';

const ManagerRegisterPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  console.log('location: ', location);

  useEffect(() => {
    const fetchEmailData = async () => {
      const token = new URLSearchParams(location.search).get('token');

      if (!token) {
        setError('Invalid token');
        setLoading(false);
        return;
      }

      try {
        const response = await LocationService.retrieveManagerEmail(token);
        if (response.data.success) {
          setUserData(prevData => ({
            ...prevData,
            email: response.data.email,
          }));
          setLocationId(response.data.locationId);
        } else {
          setError('Failed to retrieve invitation data');
        }
      } catch (err) {
        console.error('Error fetching email:', err);
        setError('Invalid or expired invitation token');
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
  }, [location.search]);

  const [userData, setUserData] = useState({
    engName: '',
    korName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    role: 'manager',
  });

  const [isValidated, setIsValidated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRegistrationSuccess = values => {
    setUserData(values);
    setIsValidated(true);
  };

  const handleRegistrationCompleted = () => {
    setIsCompleted(true);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="verify-email-page">
        <div className="verify-container">
          <div className="loading-spinner"></div>
          <h2>Loading...</h2>
          <p>Please wait while we verify your invitation.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verify-email-page">
        <div className="verify-container">
          <div className="error-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#f44336" strokeWidth="2" fill="none" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="#f44336" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2>Invitation Expired</h2>
          <p>This invitation link has expired or is invalid.</p>
          <p>Please contact your administrator to request a new invitation.</p>
          <div className="action-buttons">
            <button className="primary-button" onClick={handleBackToLogin}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isCompleted ? (
        <RegisterCompleted engName={userData.engName} />
      ) : !isValidated ? (
        <RegisterForm
          initialValues={userData}
          handleRegistrationSuccess={handleRegistrationSuccess}
        />
      ) : (
        <EmailConfirmationForm
          user={userData}
          onRegistrationComplete={handleRegistrationCompleted}
          locationId={locationId}
        />
      )}
    </>
  );
};

export default ManagerRegisterPage;

import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaCheck, FaEnvelope } from 'react-icons/fa';
import '../../assets/styles/pages/auth/EmailConfirmationPage.css';
import AuthService from '../../services/AuthService.js';

const EmailConfirmationForm = ({ user, onRegistrationComplete, locationId = null }) => {
  // State for OTP digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [code, setCode] = useState('');

  // References for input fields
  const inputRefs = useRef([]);

  // Focus first input when component mounts
  useEffect(() => {
    const fetchOTP = async () => {
      try {
        const response = await AuthService.sendOTPEmail(user.email);
        setCode(response.data.code);
        console.log(response);
      } catch (err) {
        console.error('Failed to send OTP email', err);
      }
    };

    fetchOTP();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Handle input change
  const handleChange = (index, e) => {
    const value = e.target.value;

    // Allow only numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    // Create a new array to maintain immutability
    const newOtp = [...otp];

    // Handle paste event (for entire OTP)
    if (value.length > 1) {
      // If pasted content has exactly 6 digits
      if (value.length === 6 && /^\d{6}$/.test(value)) {
        const digits = value.split('');
        setOtp(digits);
        // Focus on the last input
        if (inputRefs.current[5]) {
          inputRefs.current[5].focus();
        }
      }
      return;
    }

    // Update the specific digit
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear any previous errors when typing
    if (verificationError) {
      setVerificationError('');
    }

    // Auto-focus to next input if current field is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press events
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle verification
  const handleVerify = async () => {
    // Check if OTP is complete
    if (otp.some(digit => digit === '')) {
      setVerificationError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const enteredOtp = otp.join('');
      if (enteredOtp === code) {
        setVerificationSuccess(true);
        await AuthService.register({ user, locationId });
        // Call onRegistrationComplete instead of navigating
        setTimeout(() => {
          onRegistrationComplete();
        }, 1500);
      } else {
        setVerificationError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setVerificationError('Verification failed. Please try again later.');
      setOpt(['', '', '', '', '', '']);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    setVerificationError('');

    try {
      const response = await AuthService.sendOTPEmail(user.email);
      setCode(response.data.code);

      // Reset OTP fields
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }

      // Set countdown for resend button
      setResendCountdown(60);
    } catch (error) {
      setVerificationError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <h1>Email Verification</h1>
          <p>We've sent a verification code to your email</p>
          <div className="email-display">{user.email}</div>
        </div>

        <div className="confirmation-body">
          <p>Enter the 6-digit verification code below to verify your email address.</p>

          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6} // Allow paste of 6 digits
                value={digit}
                onChange={e => handleChange(index, e)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={`otp-input ${verificationSuccess ? 'success' : verificationError ? 'error' : ''}`}
                disabled={isVerifying || verificationSuccess}
              />
            ))}
          </div>

          {verificationError && <div className="error-message">{verificationError}</div>}

          {verificationSuccess && (
            <div className="success-message">
              <FaCheck />
              Email verified successfully!
            </div>
          )}

          <div className="button-container">
            <button
              className="resend-button"
              onClick={handleResendCode}
              disabled={resendCountdown > 0 || isResending || verificationSuccess}
            >
              {isResending ? (
                <>
                  <FaSpinner className="spinner" />
                  Resending...
                </>
              ) : resendCountdown > 0 ? (
                `Resend in ${resendCountdown}s`
              ) : (
                'Resend Code'
              )}
            </button>

            <button
              className="verify-button"
              onClick={handleVerify}
              disabled={otp.some(digit => digit === '') || isVerifying || verificationSuccess}
            >
              {isVerifying ? (
                <>
                  <FaSpinner className="spinner" />
                  Verifying...
                </>
              ) : verificationSuccess ? (
                <>
                  <FaCheck />
                  Verified
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>

          <div className="helper-text">
            Didn't receive the code? Check your spam folder or request a new code.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationForm;

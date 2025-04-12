import React, { useState } from 'react';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import {Link} from "react-router-dom";

const RegisterForm = () => {

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Agreement state
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false
  });

  // Agreement checkbox change handler
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements({
      ...agreements,
      [name]: checked
    });
  };
  
  // All agreements handler
  const handleAllAgreements = (e) => {
    const { checked } = e.target;
    setAgreements({
      terms: checked,
      privacy: checked
    });
  };

  return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Register</h1>
            <p>Create an account to use the check-in service</p>
          </div>
          <form className="register-form">
            <div className="form-grid">
              <div className="input-group">
                <label>
                  English Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="engName"
                  placeholder="English Name"
                />
              </div>

              <div className="input-group">
                <label>
                  Korean Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="korName"
                  placeholder="Korean Name"
                />
              </div>

              <div className="input-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                />
              </div>

              <div className="input-group">
                <label>
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                />
              </div>

              <div className="input-group">
                <label>
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                />
              </div>

              <div className="input-group">
                <label>
                  Password <span className="required">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                  />
                  <div
                    className="input-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                  />
                  <div
                    className="input-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
            </div>

            <div className="agreement-section">
              <h3>Terms Agreement</h3>
              <div className="agreement-checkbox">
                <input
                  type="checkbox"
                  id="all-agreements"
                  checked={agreements.terms && agreements.privacy}
                  onChange={handleAllAgreements}
                />
                <label htmlFor="all-agreements">Agree to All</label>
              </div>

              <div className="agreement-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={agreements.terms}
                  onChange={handleAgreementChange}
                />
                <label htmlFor="terms">
                  Terms of Service Agreement <span className="required">*</span>
                  <a href="#" onClick={(e) => e.preventDefault()}>View Terms</a>
                </label>
              </div>
              <div className="agreement-checkbox">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={agreements.privacy}
                  onChange={handleAgreementChange}
                />
                <label htmlFor="privacy">
                  Privacy Policy Agreement <span className="required">*</span>
                  <a href="#" onClick={(e) => e.preventDefault()}>View Policy</a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="register-button"
              /*disabled={!isFormValid || isSubmitting}*/
            >
              {/*{isSubmitting ? 'Processing...' : 'Register'}*/}
              Register
            </button>
          </form>
          <div className="login-link">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </div>
      </div>
  );
};

export default RegisterForm; 
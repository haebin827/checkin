import React, { useState } from 'react';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import {Link, useNavigate} from "react-router-dom";
import AuthService from "../../services/AuthService.js";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterForm = ({initialValues = {}, handleRegistrationSuccess}) => {
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValues = {
    engName: '',
    korName: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
    privacy: false,
    ...initialValues
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    engName: Yup.string()
      .required('English name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    korName: Yup.string()
      .max(20, 'Korean name must not exceed 20 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    username: Yup.string()
      .required('Username is required')
      .min(5, 'Username must be at least 5 characters')
      .max(20, 'Username must not exceed 20 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10,12}$/, 'Phone number must be 10-12 digits'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    terms: Yup.boolean()
      .oneOf([true], 'You must accept the Terms of Service'),
    privacy: Yup.boolean()
      .oneOf([true], 'You must accept the Privacy Policy')
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    try {
      setSubmitting(true);
      console.log("USER: ", values)
      
      const response = await AuthService.validateRegistration(values);

      if (response.data.success) {
        handleRegistrationSuccess(values);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setFieldError(err.field, err.message);
        });
      } else {
        setStatus({ generalError: 'Registration failed. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Register</h1>
          <p>Create an account to use the check-in service</p>
        </div>
        
        <Formik
          initialValues={defaultValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values, setFieldValue, status }) => (
            <Form className="register-form">
              {status && status.generalError && (
                <div className="error-message general">{status.generalError}</div>
              )}
              
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="engName">
                    English Name <span className="required">*</span>
                  </label>
                  <Field
                    type="text"
                    id="engName"
                    name="engName"
                    placeholder="English Name"
                    className={errors.engName && touched.engName ? 'error' : ''}
                  />
                  <ErrorMessage name="engName" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="korName">
                    Korean Name
                  </label>
                  <Field
                    type="text"
                    id="korName"
                    name="korName"
                    placeholder="Korean Name"
                    className={errors.korName && touched.korName ? 'error' : ''}
                  />
                  <ErrorMessage name="korName" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@email.com"
                    className={errors.email && touched.email ? 'error' : ''}
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="username">
                    Username <span className="required">*</span>
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    className={errors.username && touched.username ? 'error' : ''}
                  />
                  <ErrorMessage name="username" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    className={errors.phone && touched.phone ? 'error' : ''}
                  />
                  <ErrorMessage name="phone" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-icon-wrapper">
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Password"
                      className={errors.password && touched.password ? 'error' : ''}
                    />
                    <div
                      className="input-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="input-icon-wrapper">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                    />
                    <div
                      className="input-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>
              </div>

              <div className="agreement-section">
                <h3>Terms Agreement</h3>
                <div className="agreement-checkbox">
                  <input
                    type="checkbox"
                    id="all-agreements"
                    checked={values.terms && values.privacy}
                    onChange={(e) => {
                      setFieldValue('terms', e.target.checked);
                      setFieldValue('privacy', e.target.checked);
                    }}
                  />
                  <label htmlFor="all-agreements">Agree to All</label>
                </div>

                <div className="agreement-checkbox">
                  <Field
                    type="checkbox"
                    id="terms"
                    name="terms"
                  />
                  <label htmlFor="terms">
                    Terms of Service Agreement <span className="required">*</span>
                    <a href="#" onClick={(e) => e.preventDefault()}>View Terms</a>
                  </label>
                  <ErrorMessage name="terms" component="div" className="error-message" />
                </div>
                
                <div className="agreement-checkbox">
                  <Field
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                  />
                  <label htmlFor="privacy">
                    Privacy Policy Agreement <span className="required">*</span>
                    <a href="#" onClick={(e) => e.preventDefault()}>View Policy</a>
                  </label>
                  <ErrorMessage name="privacy" component="div" className="error-message" />
                </div>
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userSchema } from '../../validations/validations.js';

const RegisterForm = ({ initialValues = {}, handleRegistrationSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

  const defaultValues = {
    terms: false,
    privacy: false,
    ...initialValues,
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, setStatus }) => {
    let hasError = false;
    if (!values.terms) {
      setTermsError(true);
      hasError = true;
    } else {
      setTermsError(false);
    }
    if (!values.privacy) {
      setPrivacyError(true);
      hasError = true;
    } else {
      setPrivacyError(false);
    }

    if (hasError) {
      setSubmitting(false);
      return;
    }

    try {
      setSubmitting(true);

      const response = await AuthService.validateRegistration(values);

      if (response.data.success) {
        handleRegistrationSuccess(values);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach(fieldName => {
          if (values.hasOwnProperty(fieldName)) {
            setFieldError(fieldName, serverErrors[fieldName]);
          }
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckboxChange = (setFieldValue, field, value, setError) => {
    setFieldValue(field, value);
    setError(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Register {defaultValues.role === 'manager' ? 'for Manager' : ''}</h1>
          <p>Create an account to use the check-in service</p>
        </div>

        <Formik initialValues={defaultValues} validationSchema={userSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, errors, touched, values, setFieldValue, status }) => (
            <Form className="register-form">
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
                  <ErrorMessage name="engName" component="div" className="error-text" />
                </div>

                <div className="input-group">
                  <label htmlFor="korName">Korean Name</label>
                  <Field
                    type="text"
                    id="korName"
                    name="korName"
                    placeholder="Korean Name"
                    className={errors.korName && touched.korName ? 'error' : ''}
                  />
                  <ErrorMessage name="korName" component="div" className="error-text" />
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
                    disabled={!!defaultValues.email}
                  />
                  <ErrorMessage name="email" component="div" className="error-text" />
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
                  <ErrorMessage name="username" component="div" className="error-text" />
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
                  <ErrorMessage name="phone" component="div" className="error-text" />
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-icon-wrapper">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Password"
                      className={errors.password && touched.password ? 'error' : ''}
                    />
                    <div className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  <ErrorMessage name="password" component="div" className="error-text" />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="input-icon-wrapper">
                    <Field
                      type={showConfirmPassword ? 'text' : 'password'}
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
                  <ErrorMessage name="confirmPassword" component="div" className="error-text" />
                </div>
              </div>

              <div className="agreement-section">
                <h3>Terms Agreement</h3>

                <div className={`agreement-checkbox ${termsError ? 'error' : ''}`}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={values.terms}
                    onChange={e =>
                      handleCheckboxChange(setFieldValue, 'terms', e.target.checked, setTermsError)
                    }
                  />
                  <label htmlFor="terms">
                    Terms of Service Agreement <span className="required">*</span>
                    <a href="#" onClick={e => e.preventDefault()}>
                      View Terms
                    </a>
                  </label>
                </div>

                <div className={`agreement-checkbox ${privacyError ? 'error' : ''}`}>
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={values.privacy}
                    onChange={e =>
                      handleCheckboxChange(
                        setFieldValue,
                        'privacy',
                        e.target.checked,
                        setPrivacyError,
                      )
                    }
                  />
                  <label htmlFor="privacy">
                    Privacy Policy Agreement <span className="required">*</span>
                    <a href="#" onClick={e => e.preventDefault()}>
                      View Policy
                    </a>
                  </label>
                </div>
              </div>

              <button type="submit" className="register-button" disabled={isSubmitting}>
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

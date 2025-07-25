import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import '../../assets/styles/components/forms/NewLocation.css';
import { locationSchema } from '../../validations/validations.js';
import { toast } from 'react-hot-toast';
import LocationService from '../../services/LocationService.js';
import Toast from '../common/Toast.jsx';

const NewLocationForm = ({ onSuccess, onClose }) => {
  const initialValues = {
    name: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      setSubmitting(true);

      const composedAddress = [values.streetAddress, values.city, values.state, values.postalCode]
        .filter(Boolean)
        .join(', ');

      const submissionData = {
        name: values.name,
        phone: values.phone,
        address: composedAddress,
      };

      const response = await LocationService.createLocation(submissionData);

      if (response.data && response.data.success) {
        const createdLocation = response.data.location;
        toast.success('Location registered successfully!');

        if (onSuccess) {
          onSuccess(createdLocation);
        } else {
          setTimeout(() => resetForm(), 100);
        }
      }
    } catch (error) {
      console.error('Location registration failed:', error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setFieldError(err.field, err.message);
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-location-form">
      <Toast />
      {/*<h2>Register New Location</h2>*/}

      <Formik
        initialValues={initialValues}
        validationSchema={locationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values }) => {
          const composeAddress = () => {
            return [values.streetAddress, values.city, values.state, values.postalCode]
              .filter(Boolean)
              .join(', ');
          };

          return (
            <Form>
              <div className="form-group">
                <label htmlFor="name">
                  Location Name <span className="required">*</span>
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter location name"
                  className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                />
                <ErrorMessage name="name" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                />
                <ErrorMessage name="phone" component="div" className="error-text" />
              </div>

              {/* Address Section */}
              <div className="address-section">
                <h3>
                  Address <span className="address-subtitle">(United States only)</span>
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="streetAddress">
                      Street Address <span className="required">*</span>
                    </label>
                    <Field
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      placeholder="Enter street address"
                      className={`form-input ${errors.streetAddress && touched.streetAddress ? 'error' : ''}`}
                    />
                    <ErrorMessage name="streetAddress" component="div" className="error-text" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">
                      City <span className="required">*</span>
                    </label>
                    <Field
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      className={`form-input ${errors.city && touched.city ? 'error' : ''}`}
                    />
                    <ErrorMessage name="city" component="div" className="error-text" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="state">
                      State <span className="required">*</span>
                    </label>
                    <Field
                      type="text"
                      id="state"
                      name="state"
                      placeholder="Enter state"
                      className={`form-input ${errors.state && touched.state ? 'error' : ''}`}
                    />
                    <ErrorMessage name="state" component="div" className="error-text" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">
                      Postal Code <span className="required">*</span>
                    </label>
                    <Field
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      placeholder="Enter postal code (e.g. 12345)"
                      className={`form-input ${errors.postalCode && touched.postalCode ? 'error' : ''}`}
                    />
                    <ErrorMessage name="postalCode" component="div" className="error-text" />
                  </div>
                </div>

                <div className="address-preview">
                  <h4>Address Preview:</h4>
                  <p>{composeAddress()}</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
                {onClose && (
                  <button type="button" className="cancel-button" onClick={onClose}>
                    Cancel
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewLocationForm;

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../../assets/styles/components/forms/NewChild.css';
import { useAuth } from "../../hooks/useAuth.jsx";
import LocationService from "../../services/LocationService.js";
import { toast, ToastContainer } from 'react-toastify';
import ChildService from "../../services/ChildService.js";
import { childSchema } from "../../validations/validations.js";
import { ErrorMessage, Field, Form, Formik } from "formik";

const NewChildForm = () => {
  const { user } = useAuth();

  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await LocationService.getAllLocations();
        if (response.data && response.data.success) {
          setLocations(response.data.locations);
        }
      } catch (err) {
        toast.error('Failed to load locations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const initialValues = {
    engName: '',
    korName: '',
    birth: '',
    phone: '',
    locationId: user.role === 'manager' ? user.locationId : ''
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    const newChild = { ...values };

    if (user.role === 'manager') {
      newChild.locationId = user.locationId;
    }

    try {
      setSubmitting(true);
      const response = await ChildService.createChild(newChild);
      if (response.data && response.data.success) {
        toast.success('Child information registered successfully!');
        setTimeout(() => resetForm(), 100);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          setFieldError(err.field, err.message);
        });
      } else {
        setFieldError('general', 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="new-child-form">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2>Register New Child</h2>

        <Formik
            initialValues={initialValues}
            validationSchema={childSchema}
            onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
              <Form>
                {errors.general && (
                    <div className="error-message general">{errors.general}</div>
                )}

                <div className="form-group">
                  <label htmlFor="engName">
                    English Name <span className="required">*</span>
                  </label>
                  <Field
                      type="text"
                      id="engName"
                      name="engName"
                      placeholder="Enter English name"
                      className={`form-input ${errors.engName && touched.engName ? 'error' : ''}`}
                  />
                  <ErrorMessage name="engName" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="korName">Korean Name</label>
                  <Field
                      type="text"
                      id="korName"
                      name="korName"
                      placeholder="Enter Korean name"
                      className={`form-input ${errors.korName && touched.korName ? 'error' : ''}`}
                  />
                  <ErrorMessage name="korName" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="birth">
                    Birthday <span className="required">*</span>
                  </label>
                  <Field
                      type="date"
                      id="birth"
                      name="birth"
                      className={`form-input ${errors.birth && touched.birth ? 'error' : ''}`}
                  />
                  <ErrorMessage name="birth" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <Field
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                  />
                  <ErrorMessage name="phone" component="div" className="error-text" />
                </div>

                {user.role !== 'manager' && (
                    <div className="form-group">
                      <label htmlFor="locationId">
                        Location <span className="required">*</span>
                      </label>
                      {isLoading ? (
                          <div className="loading-indicator">Loading locations...</div>
                      ) : (
                          <Field
                              as="select"
                              id="locationId"
                              name="locationId"
                              className={`form-input ${errors.locationId && touched.locationId ? 'error' : ''}`}
                          >
                            <option value="">-- Select location --</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>
                                  {location.name}
                                </option>
                            ))}
                          </Field>
                      )}
                      <ErrorMessage name="locationId" component="div" className="error-text" />
                    </div>
                )}

                <div className="form-actions">
                  <button
                      type="submit"
                      className="submit-button"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </Form>
          )}
        </Formik>
      </div>
  );
};

export default NewChildForm;
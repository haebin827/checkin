import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/forms/NewChild.css';
import { useAuth } from '../../hooks/useAuth.jsx';
import LocationService from '../../services/LocationService.js';
import { toast } from 'react-hot-toast';
import ChildService from '../../services/ChildService.js';
import { childSchema } from '../../validations/validations.js';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const NewChildForm = ({ onSuccess, onClose }) => {
  const { user } = useAuth();

  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await LocationService.getAllLocations();
        if (response.data.success) {
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
    locationId: user.role === 'manager' ? user.locationId : '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    const newChild = { ...values };

    if (user.role === 'manager') {
      newChild.locationId = user.locationId;
    }

    try {
      setSubmitting(true);
      const response = await ChildService.createChild(newChild);
      if (response.data.success) {
        const createdChild = response.data.child;
        toast.success('Child information registered successfully!');

        if (onSuccess) {
          onSuccess(createdChild);
        } else {
          setTimeout(() => resetForm(), 100);
        }
      }
    } catch (error) {
      console.error('Child registration failed:', error);
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach(field => {
          const frontendField =
            field === 'eng_name'
              ? 'engName'
              : field === 'kor_name'
                ? 'korName'
                : field === 'location_id'
                  ? 'locationId'
                  : field;
          setFieldError(frontendField, backendErrors[field]);
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-child-form">
      {/*<h2>Register New Child</h2>*/}

      <Formik initialValues={initialValues} validationSchema={childSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form>
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
        )}
      </Formik>
    </div>
  );
};

export default NewChildForm;

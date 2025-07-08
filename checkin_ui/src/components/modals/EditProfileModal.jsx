import React from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { profileEditSchema } from '../../validations/validations';
import AuthService from '../../services/AuthService';

const EditProfileModal = ({ isOpen, onClose, onSubmit, initialData, updateUserData }) => {
  if (!isOpen) return null;

  const initialValues = {
    engName: initialData.eng_name || '',
    korName: initialData.kor_name || '',
    username: initialData.username || '',
    phone: initialData.phone || '',
    email: initialData.email || ''
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError, setErrors }) => {
    try {
      setSubmitting(true);
      const response = await AuthService.updateUser({
        ...values,
        id: initialData.id
      });

      if (response.data.success) {
        const updatedUserResponse = await AuthService.getUser(initialData.id);
        if (updatedUserResponse.data.success) {
          updateUserData(updatedUserResponse.data.user);
          onSubmit(true);
        } else {
          onSubmit(false);
        }
      } else {
        onSubmit(false);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach(field => {
          setFieldError(field, backendErrors[field]);
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="invite-modal">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={profileEditSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className="password-form">
              {errors.general && (
                <div className="error-text general">{errors.general}</div>
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
                <label htmlFor="korName">
                  Korean Name
                </label>
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
                <label htmlFor="username">
                  Username <span className="required">*</span>
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  className={`form-input ${errors.username && touched.username ? 'error' : ''}`}
                />
                <ErrorMessage name="username" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="e.g., 010-1234-5678"
                  className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                />
                <ErrorMessage name="phone" component="div" className="error-text" />
              </div>

              <div className="email-notice">
                <p>To change your email address, please contact the administrator.</p>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal; 
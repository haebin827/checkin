import React from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { profileEditSchema } from '../../validations/validations';
import { toast } from 'react-toastify';

const EditProfileModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  if (!isOpen) return null;

  const initialValues = {
    engName: initialData.engName || '',
    korName: initialData.korName || '',
    username: initialData.username || '',
    phone: initialData.phone || '',
    email: initialData.email || ''
  };

  console.log('Initial Values:', initialValues);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log('Form submitted with values:', values);
    try {
      setSubmitting(true);
      const success = await onSubmit(values);
      console.log('Submit response:', success);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          const field = err.param;
          setFieldError(field, err.msg);
        });
      } else {
        toast.error(error.response?.data?.message || 'Update failed. Please try again.');
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
          {({ isSubmitting, errors, touched, values }) => {
            console.log('Form State:', { values, errors, touched });
            return (
              <Form className="password-form">
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
                  <ErrorMessage name="engName" component="div" className="error-message" />
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
                  <ErrorMessage name="korName" component="div" className="error-message" />
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
                  <ErrorMessage name="username" component="div" className="error-message" />
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
                  <ErrorMessage name="phone" component="div" className="error-message" />
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
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal; 
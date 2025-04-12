import React, { useState } from 'react';
import { FaUser, FaEdit, FaTimes } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    englishName: initialData?.englishName || '',
    koreanName: initialData?.koreanName || '',
    id: initialData?.id || '',
    phone: initialData?.phone || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.englishName.trim()) {
      newErrors.englishName = 'English name is required';
    }
    
    if (!formData.koreanName.trim()) {
      newErrors.koreanName = 'Korean name is required';
    }
    
    if (!formData.id.trim()) {
      newErrors.id = 'ID is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number should contain only numbers and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
        console.error('Profile update failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="invite-modal">
        <div className="modal-header">
          <h2><FaUser /> Edit Profile</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="englishName">English Name</label>
            <input
              type="text"
              id="englishName"
              name="englishName"
              value={formData.englishName}
              onChange={handleInputChange}
              className={errors.englishName ? 'error' : ''}
            />
            {errors.englishName && (
              <div className="error-message">{errors.englishName}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="koreanName">Korean Name</label>
            <input
              type="text"
              id="koreanName"
              name="koreanName"
              value={formData.koreanName}
              onChange={handleInputChange}
              className={errors.koreanName ? 'error' : ''}
            />
            {errors.koreanName && (
              <div className="error-message">{errors.koreanName}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="id">ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className={errors.id ? 'error' : ''}
            />
            {errors.id && (
              <div className="error-message">{errors.id}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="e.g., 010-1234-5678"
            />
            {errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
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
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 
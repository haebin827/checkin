import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBuilding, FaRoad, FaCity, FaMailBulk, FaPhone } from 'react-icons/fa';
import '../../assets/styles/components/forms/NewLocation.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewLocationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing in field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }
    
    if (formData.phone && !/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Phone format should be 010-1234-5678';
    }
    
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Invalid postal code format (e.g. 12345 or 12345-6789)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const composeAddress = () => {
    return [
      formData.streetAddress,
      formData.city,
      formData.state,
      formData.postalCode,
    ].filter(Boolean).join(', ');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      const composedAddress = composeAddress();
      
      // Prepare data for submission
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        address: composedAddress
      };
      
      try {
        // Make API call to register the location
        const response = await axios.post('/api/locations', submissionData);
        
        if (response.status === 201) {
          toast.success('Location registered successfully!');
          
          // Reset form
          setFormData({
            name: '',
            phone: '',
            streetAddress: '',
            city: '',
            state: '',
            postalCode: ''
          });
        }
      } catch (error) {
        console.error('Error registering location:', error);
        toast.error(error.response?.data?.message || 'Failed to register location. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="new-location-form">
      <h2>Register New Location</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            <FaBuilding /> Location Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter location name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">
            <FaPhone /> Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number (e.g. 010-1234-5678)"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        
        <div className="address-section">
          <h3>Address <span className="address-subtitle">(United States only)</span></h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="streetAddress">
                <FaRoad /> Street Address <span className="required">*</span>
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Enter street address"
                className={errors.streetAddress ? 'error' : ''}
              />
              {errors.streetAddress && <div className="error-message">{errors.streetAddress}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="city">
                <FaCity /> City <span className="required">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state">
                <FaMapMarkerAlt /> State <span className="required">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <div className="error-message">{errors.state}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="postalCode">
                <FaMailBulk /> Postal Code <span className="required">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code (e.g. 12345)"
                className={errors.postalCode ? 'error' : ''}
              />
              {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
            </div>
          </div>
          
          <div className="address-preview">
            <h4>Address Preview:</h4>
            <p>{composeAddress()}</p>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLocationForm;
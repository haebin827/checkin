import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../../assets/styles/components/forms/NewChild.css';

const NewChildForm = () => {
  const [formData, setFormData] = useState({
    englishName: '',
    koreanName: '',
    birthday: '',
    phone: '',
    locationId: ''
  });
  
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch locations (mock data for now)
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setLocations([
        { id: 1, name: 'Suwanee Center' },
        { id: 2, name: 'Duluth Center' },
        { id: 3, name: 'Buford Center' }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);
  
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
    
    if (!formData.englishName.trim()) {
      newErrors.englishName = 'English name is required';
    }
    
    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      // Check if birthday is not in the future
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      if (birthDate > today) {
        newErrors.birthday = 'Birthday cannot be in the future';
      }
    }
    
    if (formData.phone && !/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Phone format should be 010-1234-5678';
    }
    
    if (!formData.locationId) {
      newErrors.locationId = 'Please select a location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, this would be an API call
      console.log('Submitting child data:', formData);
      alert('Child information registered successfully!');
      
      // Reset form
      setFormData({
        englishName: '',
        koreanName: '',
        birthday: '',
        phone: '',
        locationId: ''
      });
    }
  };
  
  return (
    <div className="new-child-form">
      <h2>Register New Child</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="englishName">
            <FaUser /> English Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="englishName"
            name="englishName"
            value={formData.englishName}
            onChange={handleChange}
            placeholder="Enter English name"
            className={errors.englishName ? 'error' : ''}
          />
          {errors.englishName && <div className="error-message">{errors.englishName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="koreanName">
            <FaUser /> Korean Name
          </label>
          <input
            type="text"
            id="koreanName"
            name="koreanName"
            value={formData.koreanName}
            onChange={handleChange}
            placeholder="Enter Korean name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="birthday">
            <FaCalendarAlt /> Birthday <span className="required">*</span>
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className={errors.birthday ? 'error' : ''}
          />
          {errors.birthday && <div className="error-message">{errors.birthday}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">
            <FaPhone /> Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="locationId">
            <FaMapMarkerAlt /> Location <span className="required">*</span>
          </label>
          {isLoading ? (
            <div className="loading-indicator">Loading locations...</div>
          ) : (
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className={errors.locationId ? 'error' : ''}
            >
              <option value="">-- Select location --</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          )}
          {errors.locationId && <div className="error-message">{errors.locationId}</div>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewChildForm;
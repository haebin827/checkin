import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import '../../assets/styles/components/modals/InviteModal.css';
import { useAuth } from '../../hooks/useAuth.jsx';
import ChildService from '../../services/ChildService.js';
import LocationService from '../../services/LocationService.js';

const InviteModal = ({ isOpen, onClose, onSend }) => {
  const [email, setEmail] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: null,
    location: null,
  });

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setSelectedLocation('');
      setErrors({
        email: null,
        location: null,
      });
      fetchLocations();
    }
  }, [isOpen]);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const response = await LocationService.getAllLocations();
      if (response.data.success) {
        setLocations(response.data.locations || []);
      } else {
        throw new Error('Failed to fetch locations');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        location: 'Failed to load locations. Please try again later.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = e => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setErrors({
      email: null,
      location: null,
    });

    let hasError = false;
    const newErrors = {
      email: null,
      location: null,
    };

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
        hasError = true;
      }
    }

    if (!selectedLocation) {
      newErrors.location = 'Please select a location';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const inviteData = {
      managerEmail: email,
      locationId: selectedLocation,
    };
    console.log('invitedata: ', inviteData);
    onSend(inviteData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="invite-modal">
        <div className="modal-header">
          <h2>
            <FaEnvelope /> Send Manager Invite Email
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Manager's Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter manager's email"
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Select Location</label>
            {isLoading ? (
              <div className="loading-indicator">Loading locations...</div>
            ) : (
              <>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  required
                >
                  <option value="">-- Select a location --</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.location && <div className="error-text">{errors.location}</div>}
              </>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !email || !selectedLocation}
            >
              {isLoading ? 'Loading...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;

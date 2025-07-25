import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import '../../assets/styles/components/modals/InviteModal.css';
import { useAuth } from '../../hooks/useAuth.jsx';
import ChildService from '../../services/ChildService.js';
import LocationService from '../../services/LocationService.js';

const GuardianInviteModal = ({ isOpen, onClose, onSend }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [children, setChildren] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: null,
    location: null,
    child: null,
  });

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setSelectedChild('');
      setSelectedLocation('');
      setErrors({
        email: null,
        location: null,
        child: null,
      });
      if (user.role === 'admin') {
        fetchLocations();
      } else {
        fetchChildren();
      }
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

  const fetchChildren = async (locationId = null) => {
    try {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, child: null }));
      setSelectedChild(''); // Reset child selection when location changes

      let response;
      if (user.role === 'admin') {
        if (!locationId) {
          setChildren([]);
          return;
        }
        response = await ChildService.getChildrenByLocation(locationId);
      } else {
        response = await ChildService.getChildrenByLocation(user.locationId);
      }

      if (response.data.success) {
        setChildren(response.data.children || []);
      } else {
        throw new Error('Failed to fetch children');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, child: 'Failed to load children. Please try again later.' }));
      setChildren([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = e => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    if (locationId) {
      fetchChildren(locationId);
    } else {
      setChildren([]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setErrors({
      email: null,
      location: null,
      child: null,
    });

    let hasError = false;
    const newErrors = {
      email: null,
      location: null,
      child: null,
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

    if (user.role === 'admin' && !selectedLocation) {
      newErrors.location = 'Please select a location';
      hasError = true;
    }

    if (!selectedChild) {
      newErrors.child = 'Please select a child';
      hasError = true;
    } else {
      const selectedChildData = children.find(child => child.id === parseInt(selectedChild));
      if (!selectedChildData) {
        newErrors.child = 'Please select a valid child';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const selectedChildData = children.find(child => child.id === parseInt(selectedChild));
    const inviteData = {
      guardianEmail: email,
      childId: selectedChild,
      locationId: user.role === 'admin' ? selectedLocation : user.locationId,
      childName: selectedChildData.engName,
    };
    onSend(inviteData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="invite-modal">
        <div className="modal-header">
          <h2>
            <FaEnvelope /> Send Child Invite Email
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Parent Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter parent's email"
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          {user.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="location">Select Location</label>
              {isLoading && !children.length ? (
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
          )}

          <div className="form-group">
            <label htmlFor="child">Select Child</label>
            {isLoading && children.length === 0 ? (
              <div className="loading-indicator">Loading children...</div>
            ) : (
              <>
                <select
                  id="child"
                  value={selectedChild}
                  onChange={e => setSelectedChild(e.target.value)}
                  required
                  disabled={user.role === 'admin' && !selectedLocation}
                >
                  <option value="">-- Select a child --</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {`${child.engName}${child.phone !== null ? `  (${child.phone})` : ''}`}
                    </option>
                  ))}
                </select>
                {errors.child && <div className="error-text">{errors.child}</div>}
              </>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="send-button"
              disabled={
                isLoading ||
                !email ||
                !selectedChild ||
                (user.role === 'admin' && !selectedLocation)
              }
            >
              {isLoading ? 'Loading...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuardianInviteModal;

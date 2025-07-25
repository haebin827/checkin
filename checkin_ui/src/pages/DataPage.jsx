import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import NewChildForm from '../components/forms/NewChildForm.jsx';
import NewLocationForm from '../components/forms/NewLocationForm.jsx';
import { FaUserAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../assets/styles/pages/NewPage.css';
import { useAuth } from '../hooks/useAuth.jsx';
import ChildrenDataList from '../components/ChildrenDataList.jsx';
import LocationsDataList from '../components/LocationsDataList.jsx';

const DataPage = () => {
  const { user } = useAuth();

  const nav = useNavigate();
  const [formType, setFormType] = useState('child');

  useEffect(() => {
    if (user.role !== 'manager' && user.role !== 'admin') {
      nav('/403');
    }
  }, [user, nav]);

  const handleFormTypeChange = type => {
    setFormType(type);
  };

  return (
    <>
      <Navbar />
      <div className="new-page">
        <div className="new-container">
          {user.role === 'admin' && (
            <div className="form-type-selector">
              <div className="option-tabs">
                <button
                  className={`option-tab ${formType === 'child' ? 'active' : ''}`}
                  onClick={() => handleFormTypeChange('child')}
                >
                  <FaUserAlt className="option-icon" />
                  <span>Child</span>
                </button>
                <button
                  className={`option-tab ${formType === 'location' ? 'active' : ''}`}
                  onClick={() => handleFormTypeChange('location')}
                >
                  <FaMapMarkerAlt className="option-icon" />
                  <span>Location</span>
                </button>
              </div>
            </div>
          )}

          <div className="form-container">
            {user.role === 'manager' ? (
              <ChildrenDataList />
            ) : formType === 'child' ? (
              <ChildrenDataList />
            ) : (
              <LocationsDataList />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DataPage;

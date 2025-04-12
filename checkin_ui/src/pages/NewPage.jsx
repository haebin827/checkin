import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import NewChildForm from '../components/forms/NewChildForm.jsx';
import NewLocationForm from '../components/forms/NewLocationForm.jsx';
import { FaUserAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../assets/styles/pages/NewPage.css';

const NewPage = () => {
  const [formType, setFormType] = useState('child');
  
  const handleFormTypeChange = (type) => {
    setFormType(type);
  };

  return (
    <>
      <Navbar />
      <div className="new-page">
        <div className="new-container">
          
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
          
          <div className="form-container">
            {formType === 'child' ? <NewChildForm /> : <NewLocationForm />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewPage; 
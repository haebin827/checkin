import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaUser, FaKey, FaEdit, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import EditProfileModal from '../components/modals/EditProfileModal';
import '../assets/styles/pages/MyInfo.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // 모달 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Fetch user data (mock data for now)
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        englishName: 'John Doe',
        koreanName: '홍길동',
        email: 'john.doe@example.com',
        phone: '010-1234-5678',
        id: 'john_doe',
        created_at: '2023-01-15'
      });
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Handle password change modal
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };
  
  // Handle profile edit modal
  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };
  
  // Close modals
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };
  
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  
  // Handle password change submission
  const handlePasswordSubmit = async (passwordData) => {
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Password updated successfully!');
      return true;
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  };
  
  // Handle profile update submission
  const handleProfileSubmit = async (profileData) => {
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUser(prev => ({
        ...prev,
        ...profileData,
        name: profileData.englishName // Update display name
      }));
      alert('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Navbar />
      <div className="myinfo-page">
        <div className="myinfo-container">
          <div className="page-header">
            <h1>My Profile</h1>
            
            <div className="admin-actions">
              <button className="admin-button" onClick={handleChangePassword}>
                <FaKey /> Change Password
              </button>
              <button className="admin-button invite-button" onClick={handleEditProfile}>
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading profile information...</p>
            </div>
          ) : (
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUser />
                </div>
                <div className="profile-title">
                  <h2>{user.name}</h2>
                  <p>Member since {formatDate(user.created_at)}</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaIdCard />
                  </div>
                  <div className="detail-content">
                    <label>User ID</label>
                    <p>{user.id}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaEnvelope />
                  </div>
                  <div className="detail-content">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaPhone />
                  </div>
                  <div className="detail-content">
                    <label>Phone</label>
                    <p>{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onSubmit={handlePasswordSubmit}
      />
      
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        onSubmit={handleProfileSubmit}
        initialData={{
          englishName: user?.englishName,
          koreanName: user?.koreanName,
          id: user?.id,
          phone: user?.phone
        }}
      />
    </>
  );
};

export default ProfilePage;
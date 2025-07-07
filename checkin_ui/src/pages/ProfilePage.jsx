import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaUser } from 'react-icons/fa';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import EditProfileModal from '../components/modals/EditProfileModal';
import '../assets/styles/pages/MyInfo.css';
import {useAuth} from "../hooks/useAuth.jsx";
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async() => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const response = await AuthService.getUser(user.id);
        
        if (!response.data.success) {
          toast.error('Failed to load user data');
          return;
        }
        
        setCurrUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load user information';
        toast.error(errorMessage);

        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user?.id, navigate]);

  console.log("CURR", currUser)
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };
  
  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };
  
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };
  
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  
  const handlePasswordSubmit = async (passwordData) => {
    try {
      await AuthService.changePassword({
        userId: user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password updated successfully!');
      closePasswordModal();
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
      throw error;
    }
  };
  
  const handleProfileSubmit = async (profileData) => {
    try {
      const response = await AuthService.updateUser({
        ...profileData,
        id: user.id
      });
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        const updatedUserResponse = await AuthService.getUser(user.id);
        if (updatedUserResponse.data.success) {
          setCurrUser(updatedUserResponse.data.user);
        }
        return true;
      } else {
        toast.error(response.data.message || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    }
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
                Change Password
              </button>
              <button className="admin-button invite-button" onClick={handleEditProfile}>
                Edit Profile
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUser />
                </div>
                <div className="profile-title">
                  <h2>
                    {currUser?.engName || user?.engName}
                    {(currUser?.role === 'manager' || user?.role === 'manager') && (
                      <span className="role-tag"> (Manager for {currUser?.location?.name || user?.location?.name})</span>
                    )}
                    {(currUser?.role === 'admin' || user?.role === 'admin') && (
                      <span className="role-tag"> (Admin)</span>
                    )}
                  </h2>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-item">
                  <div className="detail-content">
                    <label>User ID</label>
                    <p>{currUser?.username || user?.username}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-content">
                    <label>Email</label>
                    <p>{currUser?.email || user?.email}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-content">
                    <label>Phone</label>
                    <p>{currUser?.phone || user?.phone}</p>
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
        user={currUser || user}
      />
      
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        onSubmit={handleProfileSubmit}
        initialData={currUser || user}
      />
    </>
  );
};

export default ProfilePage;
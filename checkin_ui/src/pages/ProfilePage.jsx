import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaUser } from 'react-icons/fa';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import EditProfileModal from '../components/modals/EditProfileModal';
import '../assets/styles/pages/MyInfo.css';
import { useAuth } from '../hooks/useAuth.jsx';
import AuthService from '../services/AuthService';
import { toast } from 'react-hot-toast';
import Toast from '../components/common/Toast.jsx';

const ProfilePage = () => {
  const { user } = useAuth();
  const nav = useNavigate();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user.id) return;

      try {
        setIsLoading(true);
        const response = await AuthService.getUser(user.id);

        if (response.data.success) {
          setCurrUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user.id, nav]);

  // -----------------------------------------------------
  // Password-related
  // -----------------------------------------------------
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handlePasswordSubmit = async success => {
    if (success) {
      closePasswordModal();
      toast.success('Password updated successfully!');
    } else {
      toast.error('Failed to update password');
    }
  };

  // -----------------------------------------------------
  // Edit Profile-related
  // -----------------------------------------------------
  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleProfileSubmit = async success => {
    if (success) {
      closeProfileModal();
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <Toast />
      <div className="myinfo-page">
        <div className="myinfo-container">
          <div className="page-header">
            <h2 style={{ fontSize: '1.5rem' }}>My Profile</h2>

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
            <div className="loading-container card-style">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading...</div>
            </div>
          ) : (
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUser />
                </div>
                <div className="profile-title">
                  <h2>
                    {currUser?.engName || user?.engName}
                    {currUser?.korName || `  |  ${user?.korName}`}{' '}
                    {(currUser?.role === 'manager' || user?.role === 'manager') && (
                      <span className="role-tag">
                        {' '}
                        (Manager for {currUser?.location?.name || user?.location?.name})
                      </span>
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
                    <label>Username</label>
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onSubmit={handlePasswordSubmit}
        user={currUser || user}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        onSubmit={handleProfileSubmit}
        initialData={currUser || user}
        updateUserData={userData => setCurrUser(userData)}
      />
    </>
  );
};

export default ProfilePage;

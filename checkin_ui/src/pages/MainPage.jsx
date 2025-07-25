import React, { useState, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CheckinChildList from '../components/checkinChildList';
import QrScanner from '../components/QrScanner';
import GuardianInviteModal from '../components/modals/GuardianInviteModal.jsx';
import QrModal from '../components/modals/QrModal';
import { FaEnvelope, FaQrcode } from 'react-icons/fa';
import '../assets/styles/pages/MainPage.css';
import { useAuth } from '../hooks/useAuth.jsx';
import LocationService from '../services/LocationService.js';
import Toast from '../components/common/Toast.jsx';
import { toast } from 'react-hot-toast';
import ChildService from '../services/ChildService.js';
import ManagerInviteModal from '../components/modals/ManagerInviteModal.jsx';

const MainPage = () => {
  const { user } = useAuth();

  const [selectedChild, setSelectedChild] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState('');
  const [isManagerInviteModalOpen, setIsManagerInviteModalOpen] = useState(false);

  // -----------------------------------------------------
  // QR APIs
  // -----------------------------------------------------
  const handleQrClick = async e => {
    e.stopPropagation();
    setLoadingQr(true);
    if (!showQrModal) {
      setShowQrModal(true);
    }
    setCurrentQrCode('');

    const result = await LocationService.getQr(user.locationId);

    if (result.success) {
      setCurrentQrCode(result.qrCode);
    }
    setLoadingQr(false);
  };

  const handleDownload = () => {
    if (!currentQrCode) {
      return;
    }

    const link = document.createElement('a');
    link.href = currentQrCode;
    link.download = `qr-code.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackFromQrScan = () => {
    setSelectedChild(null);
  };

  // -----------------------------------------------------
  // Send Invite Email APIs
  // -----------------------------------------------------
  const handleSendInvite = () => {
    setIsInviteModalOpen(true);
  };

  const handleManagerInvite = () => {
    setIsManagerInviteModalOpen(true);
  };

  const handleSendGuardianInviteSubmit = async data => {
    try {
      const response = await ChildService.sendInviteEmail(data);
      if (response.data.success) {
        toast.success(
          `Invitation email sent successfully to ${data.guardianEmail} for ${data.childName}!`,
        );
        setIsInviteModalOpen(false);
      } else {
        toast.error('Failed to send invitation. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation. Please try again later.');
    }
  };

  const handleSendManagerInviteSubmit = async data => {
    try {
      const response = await LocationService.sendManagerInviteEmail(data);
      if (response.data.success) {
        toast.success(
          `Invitation email sent successfully to ${data.managerEmail} for ${response.data.locationName}.`,
        );
        setIsManagerInviteModalOpen(false);
      } else {
        toast.error('Failed to send invitation. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation. Please try again later.');
    }
  };

  const handleChildSelect = child => {
    setSelectedChild(child);
  };

  const renderContent = () => {
    if (selectedChild) {
      return <QrScanner child={selectedChild} onBack={handleBackFromQrScan} />;
    } else {
      return <CheckinChildList onSelectChild={handleChildSelect} />;
    }
  };

  return (
    <>
      <Navbar />
      <Toast />
      <div className="main-page">
        <main className="main-content">
          <div className="content-container">
            <div className="page-header">
              <h1 style={{ fontSize: '1.5rem' }}>Welcome to Check-In service.</h1>

              {user.role !== 'guardian' && (
                <div className="admin-actions">
                  <button className="admin-button invite-button" onClick={handleSendInvite}>
                    <FaEnvelope /> {user.role === 'manager' ? 'Send ' : 'Send Guardian '}
                    invite email
                  </button>
                  {user.role === 'manager' && (
                    <button className="admin-button qr-button" onClick={e => handleQrClick(e)}>
                      <FaQrcode /> QR
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      className="admin-button manager-invite-button"
                      onClick={handleManagerInvite}
                    >
                      <FaEnvelope /> Send Manager invite email
                    </button>
                  )}
                </div>
              )}
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />

      {/* Guardian Invite Modal */}
      <GuardianInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={handleSendGuardianInviteSubmit}
      />

      {/* Manager Invite Modal */}
      <ManagerInviteModal
        isOpen={isManagerInviteModalOpen}
        onClose={() => setIsManagerInviteModalOpen(false)}
        onSend={handleSendManagerInviteSubmit}
      />

      {/* QR Modal */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        loadingQr={loadingQr}
        currentQrCode={currentQrCode}
        onDownload={handleDownload}
        onRegenerate={handleQrClick}
      />
    </>
  );
};

export default MainPage;

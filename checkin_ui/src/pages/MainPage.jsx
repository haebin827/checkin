import React, { useState, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CheckinChildList from '../components/checkinChildList';
import QrScanner from '../components/QrScanner';
import InviteModal from '../components/modals/InviteModal';
import { FaEnvelope, FaQrcode } from 'react-icons/fa';
import '../assets/styles/pages/MainPage.css';
import {useAuth} from "../hooks/useAuth.jsx";
import LocationService from "../services/LocationService.js";
import Modal from "../components/common/Modal.jsx";
import Toast from "../components/common/Toast.jsx";
import { toast } from 'react-hot-toast';
import ChildService from "../services/ChildService.js";

const MainPage = () => {

  const {user} = useAuth();

  const [selectedChild, setSelectedChild] = useState(null);
  const childListRef = useRef(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [eventUrl, setEventUrl] = useState('');
  const [currentQrCode, setCurrentQrCode] = useState('');

  // -----------------------------------------------------
  // QR APIs
  // -----------------------------------------------------
  const handleQrClick = async (e) => {
    e.stopPropagation();
    setLoadingQr(true);
    setShowQrModal(true);
    setEventUrl('');
    setCurrentQrCode('');

    const result = await LocationService.getQr(user.locationId);
    
    if (result.success) {
      setCurrentQrCode(result.qrCode);
      if (result.url) {
        setEventUrl(result.url);
      }
    }
    setLoadingQr(false);
  };

  const handleDownload = () => {
    if (!currentQrCode) return;

    const link = document.createElement('a');
    link.href = currentQrCode;
    link.download = `qr-code.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQrScanSuccess = (childId, qrData) => {
    console.log(`체크인 성공 - 아이 ID: ${childId}, QR 데이터: ${qrData}`);
    
    // 체크인 상태 업데이트
    if (childListRef.current) {
      childListRef.current.updateCheckedInStatus(childId);
    }
    
    // QR 스캔 화면 닫기
    setSelectedChild(null);
  };

  // QR 스캐너에서 뒤로가기 핸들러
  const handleBackFromQrScan = () => {
    console.log('QR 스캔 취소');
    setSelectedChild(null);
  };

  // -----------------------------------------------------
  // Send Invite Email APIs
  // -----------------------------------------------------
  const handleSendInvite = () => {
    setIsInviteModalOpen(true);
  };

  const handleSendInviteSubmit = async(data) => {
    try {
      const response = await ChildService.sendInviteEmail(data);

              if (response.data.success) {
          toast.success(`Invitation email sent successfully to ${data.guardianEmail} for ${data.childName}!`);
          setIsInviteModalOpen(false);
      } else {
        toast.error(response.data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation. Please try again later.');
    }
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  const renderContent = () => {
    if (selectedChild) {
      console.log('QR 스캐너 렌더링:', selectedChild);
      return (
        <QrScanner 
          child={selectedChild}
          onBack={handleBackFromQrScan}
        />
      );
    } else {
      return (
        <CheckinChildList 
          ref={childListRef}
          onSelectChild={handleChildSelect} 
        />
      );
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
              <h1>Welcome to Check-In service.</h1>
              
              {user.role !== 'guardian' && (
                <div className="admin-actions">
                  <button 
                    className="admin-button invite-button"
                    onClick={handleSendInvite}
                  >
                    <FaEnvelope /> Send invite email
                  </button>
                  {user.role !== 'admin' &&
                    <button
                      className="admin-button qr-button"
                      onClick={(e) => handleQrClick(e)}
                    >
                      <FaQrcode /> QR
                    </button>
                  }
                </div>
              )}
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
      
      {/* Invite Modal */}
      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={handleSendInviteSubmit}
      />

      <Modal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          title="QR CODE"
      >
        <div className="qr-modal-content">
          {loadingQr ? (
              <div className="qr-loading">
                <div className="loading-spinner"></div>
                <p>Generating QR code...</p>
              </div>
          ) : (
              currentQrCode ? (
                  <div className="qr-image-container">
                    <img
                        src={currentQrCode}
                        alt="QR code"
                        className="qr-image"
                    />
                    <p className="qr-description">Scan this QR code to check in</p>
                  </div>
              ) : (
                  <div className="qr-error">
                    <p>Unable to generate QR code.</p>
                    <p>Please try again later.</p>
                  </div>
              )
          )}
          <div className="qr-modal-actions">
            {currentQrCode && !loadingQr && (
                <button
                    className="qr-download-button"
                    onClick={handleDownload}
                >
                    Download QR Code
                </button>
            )}
            <button
                className="qr-close-button"
                onClick={() => setShowQrModal(false)}
            >
                Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MainPage; 
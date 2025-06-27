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
import { toast } from 'react-hot-toast';

const MainPage = () => {

  const {user} = useAuth();

  const [selectedChild, setSelectedChild] = useState(null);
  const childListRef = useRef(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [eventUrl, setEventUrl] = useState('');
  const [currentQrCode, setCurrentQrCode] = useState('');

  const handleQrClick = async (e) => {
    e.stopPropagation();
    setLoadingQr(true);
    setShowQrModal(true);
    setEventUrl('');
    setCurrentQrCode('');

    try {
      const response = await LocationService.getQr(user.locationId);
      if (response.data && response.data.success) {
        setCurrentQrCode(response.data.qrCode);
        if (response.data.url) {
          setEventUrl(response.data.url);
        }
      } else {
        console.error('QR code generation failed:', response.data.message);
        toast.error('Failed to generate QR code');
      }
    } catch (err) {
      console.error('QR code generation failed:', err);
      toast.error('Failed to generate QR code. Please try again.');
    } finally {
      setLoadingQr(false);
    }
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

  // 아이 선택 핸들러
  const handleChildSelect = (child) => {
    console.log('아이 선택됨:', child);
    setSelectedChild(child);
  };

  // QR 스캔 성공 핸들러 (추후 구현)
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

  // Admin handler - Send invite email
  const handleSendInvite = () => {
    console.log('Send child invite email clicked');
    setIsInviteModalOpen(true);
  };

  // Invite form submit handler
  const handleSendInviteSubmit = (data) => {
    console.log('Sending invite email:', data);
    // Implement API call to send invite email
    alert(`Invite email sent to ${data.email} for child ${data.childName}`);
  };

  // 조건부 렌더링 로직
  const renderContent = () => {
    if (selectedChild) {
      console.log('QR 스캐너 렌더링:', selectedChild);
      return (
        <QrScanner 
          childId={selectedChild.id}
          childName={selectedChild.name}
          onBack={handleBackFromQrScan}
        />
      );
    } else {
      console.log('아이 목록 렌더링');
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
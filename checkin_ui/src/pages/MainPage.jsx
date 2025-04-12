import React, { useState, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CheckinChildList from '../components/checkinChildList';
import QrScanner from '../components/QrScanner';
import InviteModal from '../components/modals/InviteModal';
import { FaEnvelope, FaQrcode } from 'react-icons/fa';
import '../assets/styles/pages/MainPage.css';

const MainPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const childListRef = useRef(null);
  
  // Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Mock user role (in a real app, this would come from authentication context)
  const [userRole, setUserRole] = useState('admin'); // Change to 'user' to test non-admin view

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

  // Admin handler - QR code generation
  const handleQrGenerate = () => {
    console.log('QR generation clicked');
    // Implement QR code generation
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
              
              {userRole === 'admin' && (
                <div className="admin-actions">
                  <button 
                    className="admin-button invite-button"
                    onClick={handleSendInvite}
                  >
                    <FaEnvelope /> Send invite email
                  </button>
                  <button 
                    className="admin-button qr-button"
                    onClick={handleQrGenerate}
                  >
                    <FaQrcode /> QR
                  </button>
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
    </>
  );
};

export default MainPage; 
import React, { useState, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CheckinChildList from '../components/checkinChildList';
import QrScanner from '../components/QrScanner';
import '../assets/styles/pages/MainPage.css';

const MainPage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const childListRef = useRef(null);

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
    <div className="main-page">
      <Navbar />
      <main className="main-content">
        <div className="content-container">
          <h1>체크인 서비스에 오신 것을 환영합니다</h1>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage; 
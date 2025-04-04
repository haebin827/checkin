import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaArrowLeft } from 'react-icons/fa';
import '../assets/styles/components/QrScanner.css';

const QrScanner = ({ childId, childName, onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 카메라 스캐너 시작
  const startScanner = async () => {
    try {
      // 아이가 선택되었는지 확인
      if (!childId) {
        setErrorMessage("QR 코드를 스캔하기 전에 아이를 선택해주세요.");
        return;
      }

      const html5QrCode = new Html5Qrcode("reader");
      
      const qrCodeSuccessCallback = async (decodedText) => {
        console.log(`QR Code decoded: ${decodedText}`);
        
        try {
          // QR 코드 스캔 결과를 콘솔에 기록 (실제로는 API 호출)
          console.log(`아이 ID: ${childId}, QR 코드: ${decodedText}`);
          
          // 실제 구현 시 API 호출
          // const response = await API.post('/qr/verify', {
          //   qrCode: decodedText,
          //   childId: childId
          // });
          
          // 성공 메시지
          console.log("QR 코드 스캔 성공");
          
          // 스캐너 정지
          await stopScanner();
          
          // 뒤로 가기 (체크인 완료 후)
          setTimeout(() => {
            onBack();
          }, 1000);
          
        } catch (error) {
          console.error("QR 검증 오류:", error);
          setErrorMessage("QR 코드 검증 중 오류가 발생했습니다.");
        }
      };
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      // 첫 번째 카메라 장치로 스캐너 시작
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback
      );
      
      setScannerInstance(html5QrCode);
      setIsScanning(true);
      setErrorMessage('');
    } catch (error) {
      console.error("카메라 시작 오류:", error);
      setErrorMessage("카메라를 시작할 수 없습니다. 카메라 접근 권한을 확인해주세요.");
    }
  };
  
  // 스캐너 정지
  const stopScanner = async () => {
    if (scannerInstance) {
      try {
        await scannerInstance.stop();
        setScannerInstance(null);
        setIsScanning(false);
      } catch (error) {
        console.error("스캐너 정지 오류:", error);
        setErrorMessage("스캐너를 정지하는 중 오류가 발생했습니다.");
      }
    }
  };
  
  // 컴포넌트 언마운트 시 스캐너 정리
  useEffect(() => {
    return () => {
      if (scannerInstance) {
        scannerInstance.stop().catch(error => {
          console.error("스캐너 정지 오류:", error);
        });
      }
    };
  }, [scannerInstance]);

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <button 
          className="back-button" 
          onClick={onBack}
          aria-label="돌아가기"
        >
          <FaArrowLeft />
        </button>
        <h2>{childName} 체크인</h2>
      </div>

      <div className="qr-scanner-content">
        <div id="reader" className="qr-reader-element"></div>
        
        <div className="scanner-controls">
          {!isScanning ? (
            <button 
              onClick={startScanner} 
              className="start-scan-button"
              disabled={!childId}
            >
              카메라 열기
            </button>
          ) : (
            <button 
              onClick={stopScanner} 
              className="stop-scan-button"
            >
              스캐너 정지
            </button>
          )}
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default QrScanner; 
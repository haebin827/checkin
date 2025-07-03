import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaArrowLeft, FaCamera, FaCheckCircle } from 'react-icons/fa';
import '../assets/styles/components/QrScanner.css';
import {useAuth} from "../hooks/useAuth.jsx";
import LocationService from '../services/LocationService';

const QrScanner = ({ child, onBack }) => {

  const {user} = useAuth();

  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isCameraSelectorOpen, setIsCameraSelectorOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // 사용 가능한 카메라 목록 가져오기
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id); // 기본값으로 첫 번째 카메라 선택
        } else {
          setErrorMessage('No cameras found on your device.');
        }
      } catch (error) {
        console.error('Error getting cameras:', error);
        setErrorMessage('Failed to get cameras. Please check camera permissions.');
      }
    };

    getCameras();
  }, []);

  const qrCodeSuccessCallback = async (decodedText) => {
    // 이미 처리 중이거나 스캔이 완료된 경우 무시
    if (isProcessing || scanComplete) {
      return;
    }

    setIsProcessing(true);
    try {
      const url = new URL(decodedText);
      const uuid = url.pathname.split('/').pop();
      const token = url.searchParams.get('token');

      if (!uuid || !token) {
        throw new Error('잘못된 QR 코드입니다.');
      }

      // 스캐너 즉시 중지
      await stopScanner();
      
      const result = await LocationService.verifyQr(uuid, token, user.id, child.id);
      
      if (result.success) {
        setScanComplete(true);
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          onBack();
        }, 3000);
      } else {
        setErrorMessage(result.error);

        if (!scanComplete) {
          await startScanner();
        }
      }
    } catch (error) {
      console.error("QR 검증 오류:", error);
      setErrorMessage(error.message || "QR 코드 검증 중 오류가 발생했습니다.");

      if (!scanComplete) {
        await startScanner();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // 카메라 스캐너 시작
  const startScanner = async () => {
    try {
      if (!child) {
        setErrorMessage("QR 코드를 스캔하기 전에 아이를 선택해주세요.");
        return;
      }

      if (!selectedCamera) {
        setErrorMessage("Please select a camera first.");
        return;
      }

      // 이미 스캔이 완료된 경우 시작하지 않음
      if (scanComplete) {
        return;
      }

      const html5QrCode = new Html5Qrcode("reader");
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await html5QrCode.start(
        selectedCamera,
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

  // 카메라 변경 핸들러
  const handleCameraChange = (e) => {
    if (isScanning) {
      stopScanner().then(() => {
        setSelectedCamera(e.target.value);
      });
    } else {
      setSelectedCamera(e.target.value);
    }
  };

  // 카메라 선택기 토글 핸들러
  const toggleCameraSelector = () => {
    setIsCameraSelectorOpen(!isCameraSelectorOpen);
  };

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
        <h2>Check-In: {child.engName}</h2>
      </div>

      <div className="qr-scanner-content">
        <div className="camera-selection">
          <button 
            onClick={toggleCameraSelector}
            className="camera-toggle-button"
            disabled={isScanning || scanComplete}
          >
            <FaCamera /> Select Camera
          </button>
          {isCameraSelectorOpen && (
            <select
              id="camera-select"
              value={selectedCamera}
              onChange={handleCameraChange}
              disabled={isScanning || scanComplete}
              className="camera-select"
            >
              <option value="">-- Select a camera --</option>
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div id="reader" className="qr-reader-element"></div>
        
        <div className="scanner-controls">
          {!isScanning && !scanComplete ? (
            <button 
              onClick={startScanner} 
              className="start-scan-button"
              disabled={!child.id || !selectedCamera || scanComplete}
            >
              Open camera
            </button>
          ) : (
            <button 
              onClick={stopScanner} 
              className="stop-scan-button"
              disabled={scanComplete}
            >
              Stop Scanner
            </button>
          )}
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <FaCheckCircle className="success-icon" />
            <p>{child.engName} 체크인이 완료되었습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner; 
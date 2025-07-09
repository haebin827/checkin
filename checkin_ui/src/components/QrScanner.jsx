import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaCamera, FaCheckCircle } from 'react-icons/fa';
import '../assets/styles/components/QrScanner.css';
import { useAuth } from '../hooks/useAuth.jsx';
import LocationService from '../services/LocationService';

const QrScanner = ({ child, onBack }) => {
  const { user } = useAuth();

  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isCameraSelectorOpen, setIsCameraSelectorOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Html5Qrcode 인스턴스를 useRef에 저장
  const scannerRef = useRef(null);

  /* ─────────────────────────── 카메라 목록 읽기 ─────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices?.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        } else {
          setErrorMessage('No cameras found on your device.');
        }
      } catch (err) {
        console.error('Error getting cameras:', err);
        setErrorMessage('Failed to get cameras. Please check camera permissions.');
      }
    })();
  }, []);

  /* ─────────────────── 카메라 선택 변경 시 자동 스캔 시작 ─────────────────── */
  useEffect(() => {
    if (selectedCamera && !isScanning && !scanComplete) {
      startScanner();
    }
  }, [selectedCamera, isScanning, scanComplete]);

  /* ──────────────────────── 스캔 성공 & 실패 콜백 ──────────────────────── */
  const onScanSuccess = async decodedText => {
    if (isProcessing || scanComplete) return;

    setIsProcessing(true);
    try {
      const url = new URL(decodedText);
      const uuid = url.pathname.split('/').pop();
      const token = url.searchParams.get('token');
      if (!uuid || !token) throw new Error('잘못된 QR 코드입니다.');

      await stopScanner(); // 스캐너 중지

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
        if (!scanComplete) await startScanner();
      }
    } catch (err) {
      console.error('QR 검증 오류:', err);
      setErrorMessage(err.message || 'QR 코드 검증 중 오류가 발생했습니다.');
      if (!scanComplete) await startScanner();
    } finally {
      setIsProcessing(false);
    }
  };

  const onScanFailure = () => {
    /* 필요하면 로깅 */
  };

  /* ───────────────────────────── 스캐너 시작 ───────────────────────────── */
  const startScanner = async () => {
    try {
      if (!selectedCamera) {
        setErrorMessage('Please select a camera first.');
        return;
      }
      if (scanComplete || isScanning) return;

      const html5QrCode = new Html5Qrcode('reader');
      await html5QrCode.start(
        selectedCamera,
        { fps: 10, qrbox: { width: 300, height: 300 } },
        onScanSuccess,
        onScanFailure
      );

      scannerRef.current = html5QrCode;
      setIsScanning(true);
      setErrorMessage('');
    } catch (err) {
      console.error('카메라 시작 오류:', err);
      setErrorMessage('카메라를 시작할 수 없습니다. 카메라 접근 권한을 확인해주세요.');
    }
  };

  /* ───────────────────────────── 스캐너 정지 ───────────────────────────── */
  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        const currentCamera =
          cameras.find(cam => cam.id === selectedCamera)?.label || 'Unknown camera';
        await scanner.stop(); // 스트림 정지
        await scanner.clear(); // DOM 정리  ← 핵심!
        console.log(`Scanner stopped successfully. Camera: ${currentCamera}`);
      } catch (err) {
        console.error('스캐너 정지 오류:', err);
        setErrorMessage('스캐너를 정지하는 중 오류가 발생했습니다.');
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  /* ─────────────────────── 언마운트 시 스캐너 정리 ─────────────────────── */
  useEffect(() => {
    return () => {
      stopScanner(); // stop + clear
    };
    // 의존성 배열 비우기 → 컴포넌트 unmount 시 한 번만 실행
  }, []);

  /* ───────────────────────────── UI 렌더링 ───────────────────────────── */
  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <h2>Check-In: {child.engName}</h2>
      </div>

      <div className="qr-scanner-content">
        {/* 카메라 선택 */}
        <div className="camera-selection">
          <button
            onClick={() => setIsCameraSelectorOpen(o => !o)}
            className="camera-toggle-button"
            disabled={scanComplete}
          >
            <FaCamera /> Select Camera
          </button>

          {isCameraSelectorOpen && (
            <select
              id="camera-select"
              value={selectedCamera}
              onChange={e => {
                const newCamera = e.target.value;
                const selectedCameraLabel = cameras.find(cam => cam.id === newCamera)?.label || 'Unknown camera';
                console.log(`Selected camera: ${selectedCameraLabel}`);
                if (isScanning) {
                  stopScanner().then(() => setSelectedCamera(newCamera));
                } else {
                  setSelectedCamera(newCamera);
                }
              }}
              disabled={scanComplete}
              className="camera-select"
            >
              <option value="">-- Select a camera --</option>
              {cameras.map(cam => (
                <option key={cam.id} value={cam.id}>
                  {cam.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* QR 스캐너 뷰포트 */}
        <div id="reader" />

        {/* 컨트롤 · 에러 메시지 */}
        <div className="scanner-controls">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-modal-content">
            <FaCheckCircle className="success-icon" />
            <p>{child.engName} is checked-in successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;

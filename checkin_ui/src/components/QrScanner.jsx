import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaArrowLeft, FaBackward, FaCamera, FaCheckCircle } from 'react-icons/fa';
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

  // Html5Qrcode instance
  const scannerRef = useRef(null);

  // -----------------------------------------------------
  // Camera selector
  // -----------------------------------------------------
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

  useEffect(() => {
    if (selectedCamera && !isScanning && !scanComplete) {
      startScanner();
    }
  }, [selectedCamera, isScanning, scanComplete]);

  const handleChange = e => {
    const newCamera = e.target.value;
    const selectedCameraLabel =
      cameras.find(cam => cam.id === newCamera)?.label || 'Unknown camera';
    console.log(`Selected camera: ${selectedCameraLabel}`);
    if (isScanning) {
      stopScanner().then(() => setSelectedCamera(newCamera));
    } else {
      setSelectedCamera(newCamera);
    }
  };

  // -----------------------------------------------------
  // Scanning
  // -----------------------------------------------------
  const onScanSuccess = async decodedText => {
    if (isProcessing || scanComplete) return;

    setIsProcessing(true);
    try {
      const url = new URL(decodedText);
      const uuid = url.pathname.split('/').pop();
      const token = url.searchParams.get('token');
      if (!uuid || !token) throw new Error('Wrong QR code.');

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
        if (!scanComplete) await startScanner();
      }
    } catch (err) {
      console.error('QR verification error:', err);
      setErrorMessage('Invalid Request. Please try again.');
      if (!scanComplete) await startScanner();
    } finally {
      setIsProcessing(false);
    }
  };

  const onScanFailure = () => {
    /* 필요하면 로깅 */
  };

  // -----------------------------------------------------
  // Start scanner
  // -----------------------------------------------------
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
        onScanFailure,
      );

      scannerRef.current = html5QrCode;
      setIsScanning(true);
      setErrorMessage('');
    } catch (err) {
      console.error('Camera start error:', err);
      setErrorMessage('Unable to start camera. Please check camera access permissions.');
    }
  };

  // -----------------------------------------------------
  // Stop scanner
  // -----------------------------------------------------
  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        const currentCamera =
          cameras.find(cam => cam.id === selectedCamera)?.label || 'Unknown camera';
        await scanner.stop();
        await scanner.clear();
        console.log(`Scanner stopped successfully. Camera: ${currentCamera}`);
      } catch (err) {
        console.error('Scanner stop error:', err);
        setErrorMessage('Something went wrong while stopping the scanner.');
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  // -----------------------------------------------------
  // Unmount (Scanner-clear)
  // -----------------------------------------------------
  useEffect(() => {
    return () => {
      stopScanner(); // stop + clear
    };
  }, []);

  const goBack = async () => {
    await stopScanner();
    onBack();
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <button className="qr-scanner-close-button" onClick={goBack}>
          <FaArrowLeft /> Go back
        </button>
        <h2>
          Check-In: {child.engName} ({child.korName})
        </h2>
      </div>

      {/* QR Scanner */}
      <div id="reader" />

      <div className="qr-scanner-content">
        {/* Camera selector */}
        <div className="camera-selection">
          <button
            onClick={() => setIsCameraSelectorOpen(o => !o)}
            className="camera-toggle-button"
            disabled={scanComplete}
          >
            Camera doesn't work?
          </button>

          {isCameraSelectorOpen && (
            <select
              id="camera-select"
              value={selectedCamera}
              onChange={e => handleChange(e)}
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
      </div>

      {/* Success Modal */}
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

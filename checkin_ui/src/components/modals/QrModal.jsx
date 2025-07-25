import React from 'react';
import Modal from '../common/Modal.jsx';
import '../../assets/styles/components/modals/QrModal.css';

const QrModal = ({ isOpen, onClose, loadingQr, currentQrCode, onDownload, onRegenerate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR CODE">
      <div className="qr-modal-content">
        {loadingQr ? (
          <div className="qr-loading">
            <div className="loading-spinner"></div>
            <p>Generating QR code...</p>
          </div>
        ) : currentQrCode ? (
          <div className="qr-image-container">
            <img src={currentQrCode} alt="QR code" className="qr-image" />
            <p className="qr-description">Scan this QR code to check in</p>
          </div>
        ) : (
          <div className="qr-error">
            <p>Unable to generate QR code.</p>
            <p>Please try again later.</p>
          </div>
        )}
        <div className="qr-modal-actions">
          {currentQrCode && !loadingQr && (
            <>
              <button className="qr-download-button" onClick={onDownload}>
                Download
              </button>
              <button className="qr-regenerate-button" onClick={onRegenerate}>
                Regenerate
              </button>
            </>
          )}
          {!currentQrCode && !loadingQr && (
            <button className="qr-regenerate-button" onClick={onRegenerate}>
              Try Again
            </button>
          )}
          <button className="qr-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QrModal;

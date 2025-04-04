import React, { useEffect, useState } from 'react';

const QrScannerTest = () => {
  const [message, setMessage] = useState("라이브러리 로드 중...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // 라이브러리 존재 확인
      setMessage("라이브러리 존재 확인 중...");
      if (typeof window.Html5Qrcode !== 'undefined') {
        setMessage("Html5Qrcode 라이브러리가 전역 객체로 로드되었습니다. 정상 사용 가능합니다.");
      } else {
        // 동적 import 시도
        setMessage("전역 객체로 로드되지 않음. 모듈로 import 시도 중...");
        import('html5-qrcode')
          .then(module => {
            if (module && module.Html5Qrcode) {
              setMessage("html5-qrcode 모듈이 정상적으로 import 되었습니다. Html5Qrcode 클래스를 사용할 수 있습니다.");
            } else {
              setMessage("html5-qrcode 모듈을 import했지만 Html5Qrcode 클래스를 찾을 수 없습니다.");
              setHasError(true);
            }
          })
          .catch(error => {
            setMessage(`라이브러리 import 중 오류 발생: ${error.message}`);
            setHasError(true);
          });
      }
    } catch (error) {
      setMessage(`테스트 중 오류 발생: ${error.message}`);
      setHasError(true);
    }
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>QR 스캐너 라이브러리 테스트</h3>
      <div style={{ color: hasError ? 'red' : 'green', marginTop: '10px' }}>
        {message}
      </div>
    </div>
  );
};

export default QrScannerTest; 
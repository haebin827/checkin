import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

const defaultStyle = {
  background: '#fff',
  color: '#333',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
};

/**
 * Toast component for displaying notifications
 * @param {Object} props
 * @param {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'} [props.position='top-right'] - Toast position for desktop
 * @param {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'} [props.mobilePosition='bottom-right'] - Toast position for mobile
 * @param {number} [props.duration=3000] - Duration in milliseconds
 * @param {Object} [props.style] - Custom style to override default style
 * @param {boolean} [props.reverseOrder=false] - Whether to reverse the order of multiple toasts
 * @param {number} [props.gutter=8] - Space between toasts
 */
const Toast = ({
  position = 'top-right',
  mobilePosition = 'bottom-right',
  duration = 3000,
  style = {},
  reverseOrder = false,
  gutter = 8,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentPosition = isMobile ? mobilePosition : position;

  return (
    <Toaster
      position={currentPosition}
      reverseOrder={reverseOrder}
      gutter={gutter}
      toastOptions={{
        duration,
        style: {
          ...defaultStyle,
          ...style,
        },
      }}
    />
  );
};

export default Toast;

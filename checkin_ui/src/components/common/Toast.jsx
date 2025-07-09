import { Toaster } from 'react-hot-toast';

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
 * @param {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'} [props.position='top-right'] - Toast position
 * @param {number} [props.duration=3000] - Duration in milliseconds
 * @param {Object} [props.style] - Custom style to override default style
 * @param {boolean} [props.reverseOrder=false] - Whether to reverse the order of multiple toasts
 * @param {number} [props.gutter=8] - Space between toasts
 */
const Toast = ({
  position = 'top-right',
  duration = 3000,
  style = {},
  reverseOrder = false,
  gutter = 8,
}) => {
  return (
    <Toaster
      position={position}
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

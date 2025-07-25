import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname;
  const isOAuthRelated = currentPath.includes('/auth/') || currentPath.includes('/additional-info');

  if (loading && !isOAuthRelated) {
    return (
      <div className="loading-container full-page">
        <div className="loading-spinner large"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

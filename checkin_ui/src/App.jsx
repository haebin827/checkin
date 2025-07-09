import './App.css';
import LoginPage from './pages/auth/LoginPage.jsx';
import Error404 from './pages/errors/404.jsx';
import ForgotIdOrPwPage from './pages/auth/ForgotIdOrPwPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import MainPage from './pages/MainPage.jsx';
import FindUsernamePage from './pages/auth/FindUsernamePage.jsx';
import { Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import NewPage from './pages/NewPage.jsx';
import Error500 from './pages/errors/500.jsx';
import Error401 from './pages/errors/401.jsx';
import Error403 from './pages/errors/403.jsx';
import React from 'react';
import { AuthProvider } from './hooks/useAuth.jsx';
import AdditionalInfoPage from './pages/auth/AdditionalInfoPage';
import PrivateRoute from './routes/PrivateRoute.jsx';
import DataPage from './pages/DataPage.jsx';
import { ToastContainer } from 'react-toastify';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path={'/'} element={<LoginPage />} />
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/forgot'} element={<ForgotIdOrPwPage />} />
          <Route path={'/register'} element={<RegisterPage />} />
          <Route path={'/additional-info'} element={<AdditionalInfoPage />} />

          <Route
            path={'/main'}
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/history'}
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/new'}
            element={
              <PrivateRoute>
                <NewPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/data'}
            element={
              <PrivateRoute>
                <DataPage />
              </PrivateRoute>
            }
          />
          <Route
            path={'/profile'}
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path={'/verify-email'} element={<FindUsernamePage />} />
          <Route path={'/reset-password'} element={<ResetPasswordPage />} />
          {/* Error Pages */}
          <Route path={'/error/500'} element={<Error500 />} />
          <Route path={'/error/401'} element={<Error401 />} />
          <Route path={'/error/403'} element={<Error403 />} />
          <Route path={'*'} element={<Error404 />} />
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

export default App;

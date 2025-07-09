import '../../assets/styles/pages/auth/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService.js';

const LoginPage = () => {
  const nav = useNavigate();
  const { user, loading, checkSession } = useAuth();

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockInfo, setLockInfo] = useState({
    isLocked: false,
    remainingTime: 0,
    attempts: 0,
    remaining: 5,
  });
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (user) {
      nav('/main');
    }
  }, [user, nav]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && lockInfo.isLocked) {
      setLockInfo(prev => ({ ...prev, isLocked: false }));
    }

    return () => clearInterval(timer);
  }, [countdown, lockInfo.isLocked]);

  const handleChange = e => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (error && !lockInfo.isLocked) {
      setError('');
    }
  };

  const handleGoogleLogin = () => {
    AuthService.googleLogin();
  };

  const handleKakaoLogin = () => {
    AuthService.kakaoLogin();
  };

  const handleLogin = async e => {
    e.preventDefault();

    if (!loginData.username || !loginData.password || lockInfo.isLocked) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.login(loginData);

      if (response.data.success) {
        await checkSession();
        nav('/main');
      } else {
        if (response.data.isLocked) {
          setLockInfo({
            isLocked: true,
            remainingTime: response.data.remainingTime || 300,
            attempts: response.data.attempts || 0,
            remaining: response.data.remaining || 0,
          });
          setCountdown(response.data.remainingTime || 300);
        } else if (response.data.attempts) {
          // 0을 포함한 모든 값 처리
          setLockInfo({
            isLocked: false,
            remainingTime: 0,
            attempts: response.data.attempts || 0,
            remaining: response.data.remaining || 5,
          });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        if (err.response.data.isLocked) {
          setLockInfo({
            isLocked: true,
            remainingTime: err.response.data.remainingTime || 300,
            attempts: err.response.data.attempts || 0,
            remaining: err.response.data.remaining || 0,
          });
          setCountdown(err.response.data.remainingTime || 300);
        } else if (err.response.data.attempts) {
          // 0을 포함한 모든 값 처리
          setLockInfo({
            isLocked: false,
            remainingTime: 0,
            attempts: err.response.data.attempts || 0,
            remaining: err.response.data.remaining || 5,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !lockInfo.isLocked) {
      handleLogin(e);
    }
  };

  const formatRemainingTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getLockInfoMessage = () => {
    if (lockInfo.isLocked) {
      return (
        <div className="lock-message">
          <p>Account Temporarily Locked</p>
          <p>For your security, login has been disabled for {formatRemainingTime(countdown)}.</p>
          <p>Please try again later or contact support if you need assistance.</p>
        </div>
      );
    } else if (lockInfo.attempts > 0) {
      return (
        <div className="attempt-info">
          <p>Login Attempt Warning</p>
          <p>Failed attempts: {lockInfo.attempts} of 5</p>
          {/*<p>Remaining attempts: {lockInfo.remaining}</p>*/}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Check-In</h1>
          <p>Smart check-in system for children</p>
        </div>

        {getLockInfoMessage()}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              name={'username'}
              value={loginData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Username"
              disabled={isLoading || lockInfo.isLocked}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name={'password'}
              value={loginData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              disabled={isLoading || lockInfo.isLocked}
            />
          </div>

          <div className="login-options">
            <Link to="/forgot" className="forgot-password">
              Forgot username or password?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || lockInfo.isLocked}
          >
            {isLoading ? 'Signing in...' : lockInfo.isLocked ? 'Locked' : 'Sign In'}
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button className="social-button google" onClick={handleGoogleLogin}>
              Sign In with Google
            </button>
            <button className="social-button kakao" onClick={handleKakaoLogin}>
              Sign In with KakaoTalk
            </button>
          </div>
        </form>

        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import '../../assets/styles/pages/LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Check-In</h1>
                    <p>Smart check-in system for children</p>
                </div>

                <form className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div className="login-options">
                        <Link to="/forgot" className="forgot-password">Forgot password?</Link>
                    </div>

                    <button type="submit" className="login-button">Sign In</button>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <div className="social-login">
                        <button type="button" className="social-button google">
                            Sign In with Google
                        </button>
                        <button type="button" className="social-button kakao">
                            Sign In with KakaoTalk
                        </button>
                    </div>
                </form>

                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
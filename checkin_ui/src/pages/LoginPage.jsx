import '../assets/styles/pages/LoginPage.css';

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
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" className="login-button">Sign In</button>
                    
                    <div className="login-divider">
                        <span>or</span>
                    </div>
                    
                    <div className="social-login">
                        <button type="button" className="social-button google">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Sign In with Google
                        </button>
                        <button type="button" className="social-button kakao">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M12 3C6.48 3 2 6.48 2 11c0 2.79 1.46 5.26 3.67 6.77l-1.45 4.32c-.1.31.25.56.54.4l4.96-2.9c.78.15 1.58.23 2.4.23 5.52 0 10-3.48 10-8s-4.48-8-10-8" fill="#FEE500"/>
                                <path d="M13.54 11.88c-.12.37-.38.65-.72.83-.34.18-.76.27-1.23.26h-.14v1.77h-1.09v-5.48h1.28c.43 0 .8.07 1.1.22.31.15.54.36.71.63.16.27.25.59.25.95 0 .28-.05.55-.16.82zm-2.09-.41h.16c.2 0 .35-.05.47-.14.12-.09.17-.24.17-.43 0-.18-.06-.32-.18-.42-.12-.1-.28-.14-.49-.14h-.13v1.13z" fill="#000"/>
                            </svg>
                            Sign In with KakaoTalk
                        </button>
                    </div>
                </form>
                
                <div className="register-link">
                    <p>Don't have an account? <a href="#">Sign Up</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
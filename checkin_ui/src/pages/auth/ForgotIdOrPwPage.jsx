import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/pages/ForgotIdOrPw.css';

const ForgotIdOrPwPage = () => {
    const [searchType, setSearchType] = useState('id');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // 여기에서 API 호출 로직을 구현할 예정
        console.log(`Sending ${searchType} recovery request to ${email}`);
        
        // 요청 완료 후 상태 리셋 (실제로는 API 응답 후 처리)
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`Recovery email sent to ${email}`);
        }, 1500);
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <div className="forgot-header">
                    <h1>Account Recovery</h1>
                    <p>Select an option to recover your account information</p>
                </div>
                
                <form className="forgot-form" onSubmit={handleSubmit}>
                    <div className="radio-group">
                        <div className="radio-option">
                            <input 
                                type="radio" 
                                id="find-id" 
                                name="search-type" 
                                value="id" 
                                checked={searchType === 'id'}
                                onChange={() => setSearchType('id')}
                                className="radio-input"
                            />
                            <label htmlFor="find-id" className="radio-label">
                                <span className="radio-text">Find ID</span>
                            </label>
                        </div>
                        
                        <div className="radio-option">
                            <input 
                                type="radio" 
                                id="reset-pw" 
                                name="search-type" 
                                value="pw" 
                                checked={searchType === 'pw'}
                                onChange={() => setSearchType('pw')}
                                className="radio-input"
                            />
                            <label htmlFor="reset-pw" className="radio-label">
                                <span className="radio-text">Reset PW</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="send-button"
                        disabled={!email || isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Recovery Email'}
                    </button>
                </form>
                
                <div className="back-link">
                    <span>Remember your account?</span>
                    <Link to="/">Return to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotIdOrPwPage;

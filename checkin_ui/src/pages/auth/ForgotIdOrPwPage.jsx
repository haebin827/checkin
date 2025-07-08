import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/pages/auth/ForgotIdOrPw.css';
import AuthService from "../../services/AuthService.js";
import Toast from "../../components/common/Toast.jsx";
import { toast } from 'react-hot-toast';

const ForgotIdOrPwPage = () => {
    const [searchType, setSearchType] = useState('id');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true)
        try {
            await AuthService.findAccount({
                email,
                searchType
            });
            toast.success('If an account exists with that email, you will receive an email shortly.');
        } catch (err) {
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="forgot-container">
            <Toast />
            <div className="forgot-card">
                <div className="forgot-header">
                    <h1>Account Recovery</h1>
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

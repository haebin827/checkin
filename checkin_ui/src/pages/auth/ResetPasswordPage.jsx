import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import '../../assets/styles/pages/auth/ResetPasswordPage.css';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const nav = useNavigate();

    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            // 임시
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (!token) {
                setError('Invalid or missing token');
                return;
            }

            console.log(newPassword)
            const response = await AuthService.resetPassword({
                token,
                newPassword
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    nav('/');
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-box">
                <h1>Reset Password</h1>

                {success ? (
                    <div className="success-message">
                        <p>Your password has been successfully reset!</p>
                        <p>You will be redirected to the login page shortly...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="reset-button"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() => nav('/')}
                            disabled={loading}
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
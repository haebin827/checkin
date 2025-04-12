import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/pages/auth/AdditionalInfoPage.css';
import AuthService from '../../services/AuthService';
import {useAuth} from "../../hooks/useAuth.jsx";

const AdditionalInfoPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [formData, setFormData] = useState({
        engName: '',
        korName: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // 이미 완전히 등록된 사용자는 메인 페이지로 리다이렉트
        if (isAuthenticated && !user.isTemporary) {
            navigate('/main');
        }
    }, [isAuthenticated, user, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.engName.trim()) {
            setError('English name is required');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!/^\d{10,12}$/.test(formData.phone)) {
            setError('Please enter a valid phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');
        
        try {
            // 추가 정보를 서버로 전송하여 사용자 등록 완료
            const response = await AuthService.updateAdditionalInfo({
                engName: formData.engName,
                korName: formData.korName,
                phone: formData.phone
            });
            
            if (response.data && response.data.success) {
                // 성공적으로 등록이 완료되면 메인 페이지로 이동
                await AuthService.getCurrentSession(); // 세션 정보 갱신
                navigate('/main');
            } else {
                setError(response.data.message || 'Failed to complete registration');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update information');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="additional-info-container">
            <div className="additional-info-card">
                <div className="card-header">
                    <h2>Additional Information</h2>
                    <p>Please provide your information to complete registration</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="engName">English Name</label>
                        <input
                            type="text"
                            id="engName"
                            name="engName"
                            value={formData.engName}
                            onChange={handleChange}
                            placeholder="Enter your English name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="korName">Korean Name (Optional)</label>
                        <input
                            type="text"
                            id="korName"
                            name="korName"
                            value={formData.korName}
                            onChange={handleChange}
                            placeholder="Enter your Korean name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdditionalInfoPage; 
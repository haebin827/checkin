import http from "../http-common.js";

const login = (data) => {
    return http.post(`/auth/login`, data);
};

const logout = () => {
    return http.post(`/auth/logout`);
}

const getCurrentSession = () => {
    return http.get(`/auth`)
}

const register = (data) => {
    return http.post(`/auth/register`, data)
}

const validateRegistration = (data) => {
    return http.post(`/auth/validate-registration`, data)
}

const sendOTPEmail = (email) => {
    return http.post(`/auth/opt-email`, {email: email});
}

const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_APP_API_PORT}/auth/google`;
};

const kakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_APP_API_PORT}/auth/kakao`;
};

const findAccount = (data) => {
    return http.post(`/auth/find-account`, data)
};

const verifyUsername = (token) => {
    return http.get(`/auth/verify-username?token=${token}`)
};

const resetPassword = (data) => {
    return http.post(`/auth/reset-password`, data)
};

const changePassword = (data) => {
    return http.post(`/auth/change-pw`, data);
};

const updateAdditionalInfo = (data) => {
    return http.post(`/auth/update-info`, data)
}

const getUser = async (id) => {
    if (!id) {
        throw new Error('User ID is required');
    }
    
    try {
        return await http.get(`/auth/user?id=${id}`);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
    }
}

const updateUser = (data) => {
    return http.post(`/auth/update`, data)
}

const AuthService = {
    login,
    logout,
    getCurrentSession,
    register,
    validateRegistration,
    googleLogin,
    kakaoLogin,
    sendOTPEmail,
    findAccount,
    verifyUsername,
    resetPassword,
    changePassword,
    updateAdditionalInfo,
    getUser,
    updateUser
}

export default AuthService;
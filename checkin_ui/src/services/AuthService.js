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
    console.log("Email: ", email)
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

const updateAdditionalInfo = (data) => {
    return http.post(`/auth/update-info`, data)
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
    updateAdditionalInfo
}

export default AuthService;
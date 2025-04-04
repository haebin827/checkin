const AuthService = require('../services/AuthService');
const EmailService = require('../services/EmailService');
const {validationResult} = require('express-validator');

exports.login = async(req, res) => {

    const {username, password} = req.body;

    try {
        const user = await AuthService.login(username, password, req);
        res.status(200).json({
            success: true,
            user
        });
    } catch(err) {
        // 로그인 실패 시 시도 제한 정보 추가
        const limiterInfo = req.rateLimit || {};

        console.log("RATE LIMIT: ", req.rateLimit)
        res.status(400).json({
            success: false,
            message: err.message,
            attempts: limiterInfo.current || 0,
            remaining: limiterInfo.remaining || 5,
            isLocked: limiterInfo.remaining === 0,
            remainingTime: limiterInfo.remaining === 0 ? 5 * 60 : null
        });
    }
};

exports.logout = async(req, res) => {
    try {
        await AuthService.logout(req.session, res);
        res.status(200).json({
            success: true,
            message: "Logout successfully"
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message || "error"
        });
    }
};

exports.validateRegistration = [
    //registerValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log("AuthController/register: ", errors.array());
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        return res.status(200).json({success: true});
    }
];

exports.register = async (req, res) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json({success: true, user});
    } catch (err) {
        console.error("AuthController/register: ", err.message);
        res.status(500).json({ success: false, message: err.message || 'error'});
    }
};

exports.getCurrentSession = async (req, res) => {
    try {
        const user = await AuthService.findCurrentSession(req.session);
        res.status(200).json({success: true, user})
    } catch (err) {
        res.status(500).json({success: false, message: err.message || 'error'})
    }
};

exports.sendOTPEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'No email found'
        });
    }

    try {
        const data = await EmailService.sendEmail(email);

        res.status(200).json({
            success: true,
            code: data.code,
            expiresIn: data.expiresIn,
            maxAttempts: data.maxAttempts
        });
    } catch (err) {
        console.error("EmailService/sendWelcomeEmail:", err);
        res.status(500).json({ success: false, message: err.message || 'Fail to send an email' });
    }
};

// ---------------------------------------------------------
// Social login
// ---------------------------------------------------------
exports.authentication = async(req, res) => {
    if (req.user) {
        req.session.user = {
            id: req.user.id,
            username: req.user.username,
            name: req.user.name,
            role: req.user.role
        };
    }
    res.redirect(`${process.env.CORS_ORIGIN_URL}/home`);
};

exports.loginFailed = async(req, res) => {
    res.status(401).json({
        success: false,
        message: 'Failed to login with Kakao.'
    });
};

// ---------------------------------------------------------
// Find ID/PW
// ---------------------------------------------------------

exports.handleFindRequest = async (req, res) => {
    try {
        const { email, searchType } = req.body;

        if (!email || !searchType) {
            return res.status(400).json({
                success: false,
                message: 'Email or searchType is required'
            });
        }
        const data = await AuthService.handleFindRequest(email, searchType);
        res.status(200).json({success: true, message: data.message})
    } catch (err) {
        console.error('Error in handleFindRequest:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to process request'
        });
    }
};

exports.verifyUsername = async (req, res) => {
    try {
        const { token } = req.query;
        console.log(token);
        const decoded = EmailService.verifyToken(token);
        console.log("DECODED: ", decoded)

        if (decoded.type !== 'findId') {
            return res.status(400).json({ success: false, message: 'Invalid token type' });
        }

        const user = await AuthService.findUserByEmail(decoded.email)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({
            success: true,
            username: user.username
        });
    } catch (err) {
        console.error('Error in verifyEmail:', err);
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = EmailService.verifyToken(token);

        if (decoded.type !== 'resetPassword') {
            return res.status(400).json({ success: false, message: 'Invalid token type' });
        }

        const updatedUser = await AuthService.updateUserByPassword(newPassword, decoded.email)

        return res.json({
            success: true,
            updatedUser,
            message: 'Password reset successfully'
        });
    } catch (err) {
        console.error('Error in resetPassword:', err);
        return res.status(400).json({ success: false, message: 'Failed to reset password' });
    }
};
const AuthService = require('../services/AuthService');
const EmailService = require('../services/EmailService');
const {validationResult} = require('express-validator');
const db = require('../models');
const {updateUserValidation} = require('../validations/validations');

exports.login = async(req, res) => {
    const {username, password} = req.body;

    try {
        const user = await AuthService.login(username, password, req);
        res.status(200).json({
            success: true,
            user
        });
    } catch(err) {
        const limiterInfo = req.rateLimit || {};

        console.log("RATE LIMIT: ", req.rateLimit)
        res.status(500).json({
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
    //userValidation,
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
            message: "No email found"
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
        console.error("AuthService/sendWelcomeEmail:", err);
        res.status(500).json({ success: false, message: err.message || "Fail to send an email" });
    }
};

exports.changePassword = async(req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Datas are required"
            });
        }

        await AuthService.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (err) {
        console.error("AuthController/changePassword:", err);
        res.status(500).json({ 
            success: false, 
            message: "Failed to change password"
        });
    }
};

exports.getUser = async(req, res) => {
    const {id} = req.query;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const user = await AuthService.getUser(id);

        res.status(200).json({
            success: true,
            user
        });
    } catch(err) {
        console.error("AuthController/getUser:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user data"
        });
    }
};

exports.updateUser = [
    //updateUserValidation,
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = req.body;
        console.log("edit user: ", user);
        try {
            const response = await AuthService.updateUser(user);
            res.status(200).json({success: true, user: response});
        } catch(err) {
            console.error("AuthController/updateUser:", err);
            res.status(500).json({
                success: false,
                message: "Failed to update user data"
            });
        }
    }
];

// ---------------------------------------------------------
// Social login
// ---------------------------------------------------------

exports.authentication = async(req, res) => {
    if (req.user) {
        // 임시 사용자인 경우 추가 정보 페이지로 리다이렉트
        if (req.user.isTemporary) {
            req.session.tempUser = req.user;
            return res.redirect(`${process.env.CORS_ORIGIN_URL}/additional-info`);
        }

        req.session.user = {
            id: req.user.id,
            username: req.user.username,
            name: req.user.engName,
            role: req.user.role,
            email: req.user.email,
            phone: req.user.phone
        };

        res.redirect(`${process.env.CORS_ORIGIN_URL}/main`);
    } else {
        res.redirect(`${process.env.CORS_ORIGIN_URL}/login`);
    }
};

exports.loginFailed = async(req, res) => {
    res.status(401).json({
        success: false,
        message: 'Failed to login with social account.'
    });
};

exports.completeRegistration = async (req, res) => {
    try {
        const tempUser = req.session.tempUser;
        if (!tempUser || !tempUser.isTemporary) {
            return res.status(400).json({
                success: false,
                message: 'No temporary user found'
            });
        }

        const { engName, korName, phone } = req.body;
        if (!engName || !phone) {
            return res.status(400).json({
                success: false,
                message: 'English name and phone number are required'
            });
        }

        if (!/^\d{10,12}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        const transaction = await db.sequelize.transaction();
        try {
            const userData = {
                googleId: tempUser.googleId || null,
                kakaoId: tempUser.kakaoId || null,
                email: tempUser.email,
                username: tempUser.username,
                role: tempUser.role,
                engName: engName,
                korName: korName || null,
                phone: phone
            };

            const newUser = await db.user.create(userData, { transaction });
            await transaction.commit();

            delete req.session.tempUser;
            req.session.user = {
                id: newUser.id,
                username: newUser.username,
                name: newUser.engName,
                role: newUser.role,
                email: newUser.email,
                phone: newUser.phone
            };

            return res.status(201).json({
                success: true,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    engName: newUser.engName,
                    role: newUser.role
                }
            });
        } catch (err) {
            await transaction.rollback();
            console.error('User creation error:', err);
            return res.status(500).json({
                success: false,
                message: err.message || 'Failed to create user'
            });
        }
    } catch (err) {
        console.error('Complete registration error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to complete registration'
        });
    }
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
        const decoded = EmailService.verifyToken(token);

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
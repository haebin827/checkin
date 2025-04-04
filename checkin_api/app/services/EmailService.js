const nodemailer = require('nodemailer');
const emailConfig = require('../configs/emailConfig');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport(emailConfig);

function generateCode() {

    //return crypto.randomBytes(3).toString('hex');

    // ------------------------------------------------------------------
    // crypto.randomInt(): 내부적으로 OS의 암호학적 난수 생성기를 사용
    // ------------------------------------------------------------------
    // 운영체제의 보안 엔트로피 소스를 기반으로 한 암호학적으로 안전한 난수 생성기(CSPRNG) 를 사용
    //  => 시드 노출 없이 시스템이 가진 물리적 난수 소스(마우스 움직임, 키보드 입력, 네트워크 노이즈 등) 를 기반으로 한 예측 불가능하고 공격에 강한 난수값을 생성
    // ------------------------------------------------------------------
    return crypto.randomInt(100000, 1000000).toString();
}

function generateToken(data) {
    return jwt.sign(
        data,
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
    );
}

function verifyToken(token) {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

async function sendEmail(email) {

    const verificationCode = generateCode();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h3 style="color: #333;">Please enter the code below to complete your verification.</h3>
      <p><strong>Verification Code: ${verificationCode}</strong></p>
      <p>The code is valid for 3 minutes.</p>
    </div>
  `;

    const info = await transporter.sendMail({
        from: emailConfig.auth.user,
        to: email,
        subject: '[BSS] Signup Verification Code',
        html: htmlContent
    });

    return {
        info,
        code: verificationCode,
        expiresIn: 180,
        maxAttempts: 5
    };
}

async function sendFindIdEmail(email) {
    const token = generateToken({ email, type: 'findId' });
    const link = `http://localhost:5051/verify-email?token=${token}`;
    //const verificationLink = `http://10.9.5.157:5051/verify-email?token=${token}`;
    try {
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: email,
            subject: '[BSS] Your Account ID',
            html: `
                <h1>Find Your Account ID</h1>
                <p>Click the link below to view your account ID:</p>
                <a href="${link}">View Account ID</a>
                <p>This link will expire in 5 minutes.</p>
            `
        });
        return true;
    } catch (err) {
        console.error('Email sending failed:', err);
        throw new Error('Failed to send email');
    }
}

async function sendPasswordResetEmail(email) {
    const token = generateToken({ email, type: 'resetPassword' });
    const link = `http://localhost:5051/reset-password?token=${token}`;
    //const resetLink = `http://10.9.5.157:5051/reset-password?token=${token}`;
    try {
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: email,
            subject: '[BSS] Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${link}">Reset Password</a>
                <p>This link will expire in 5 minutes.</p>
            `
        });
        return true;
    } catch (err) {
        console.error('Email sending failed:', err);
        throw new Error('Failed to send email');
    }
}

module.exports = {
    sendEmail,
    sendFindIdEmail,
    sendPasswordResetEmail,
    verifyToken
};
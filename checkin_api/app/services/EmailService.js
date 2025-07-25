const nodemailer = require('nodemailer');
const emailConfig = require('../configs/emailConfig');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AppError = require('../middlewares/AppError');

const transporter = nodemailer.createTransport(emailConfig);

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function generateToken(data, expiresIn = '5m') {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
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

  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Signup Verification Code',
      html: htmlContent,
    });
  } catch (err) {
    console.error('Email sending failed:', err);
    throw new AppError('Internal Server Error', 500);
  }

  return {
    code: verificationCode,
    expiresIn: 180,
    maxAttempts: 5,
  };
}

async function sendFindIdEmail(email) {
  const token = generateToken({ email, type: 'findId' }, '5m');
  const link = `${process.env.CORS_ORIGIN_URL}/verify-email?token=${token}`;
  //const verificationLink = `http://10.9.5.157:5051/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Your Account ID',
      html: `
                <h1>Find Your Account ID</h1>
                <p>Click the link below to view your account ID:</p>
                <a href="${link}">View Account ID</a>
                <p>This link will expire in 5 minutes.</p>
            `,
    });
    return true;
  } catch (err) {
    console.error('Email sending failed:', err);
    throw new AppError('Internal Server Error', 500);
  }
}

async function sendPasswordResetEmail(email) {
  const token = generateToken({ email, type: 'resetPassword' }, '5m');
  const link = `${process.env.CORS_ORIGIN_URL}/reset-password?token=${token}`;
  //const resetLink = `http://10.9.5.157:5051/reset-password?token=${token}`;
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Password Reset Request',
      html: `
                <h1>Password Reset</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${link}">Reset Password</a>
                <p>This link will expire in 5 minutes.</p>
            `,
    });
    return true;
  } catch (err) {
    throw new AppError('Internal Server Error', 500);
  }
}

async function sendGuardianInviteEmail(email, childName) {
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Invitation to Register Your Child',
      html: `
              <h2>Your Child Has Been Successfully Registered</h2>
              <p>The account for your child <strong>${childName}</strong> has been successfully registered in the system.</p>
              <p>You can now log in to manage your child's information and view updates.</p>
              
              <p>If you have any questions or concerns, please contact our support team.</p>
              <p>Thank you,</p>
            `,
    });
    return true;
  } catch (err) {
    console.error('ERR0R: ', err);
    throw new AppError('Internal Server Error', 500);
  }
}

async function sendCheckinEmail({
  email,
  checkinTime,
  childName,
  locationName,
  name,
  attemptMaker,
}) {
  if (attemptMaker === 'manager') {
    name = `${name} <span style="color: #ff0000;">(Manager)</span>`;
  } else if (attemptMaker === 'admin') {
    name = `${name} <span style="color: #ff0000;">(Admin)</span>`;
  }
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: `❗ ${childName} has checked in at ${locationName}`,
      html: `
              <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #d9534f;">Check-in Notification</h2>
                <p>We would like to inform you that your child <strong>${childName}</strong> has successfully checked in at <strong>${locationName}</strong>.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
                <h3 style="margin-top: 20px;">Check-in Details</h3>
                <ul style="padding-left: 20px; list-style: disc;">
                  <li><strong>Date & Time:</strong> ${checkinTime}</li>
                  <li><strong>Checked in by:</strong> ${name}</li>
                  <li><strong>Child's Name:</strong> ${childName}</li>
                  <li><strong>Location:</strong> ${locationName}</li>
                </ul>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
                
                <p style="margin-top: 20px;">
                  If you wish to stop receiving SMS notifications, please log in to the Check-in portal and uncheck the SMS setting for this child.
                </p>
            
                <p style="margin-top: 20px;">Thank you,</p>
              </div>
            `,
    });
    return true;
  } catch (err) {
    throw new AppError('Internal Server Error', 500);
  }
}

async function sendManagerInviteEmail(email, locationId, locationName) {
  const token = generateToken({ email, type: 'inviteManager', locationId }, '1440m');
  const link = `${process.env.CORS_ORIGIN_URL}/invitation?token=${token}`;
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: `❗ Manager Registration Invitation for ${locationName}`,
      html: `
                <h2>Invitation for Check-in System</h2>
                <p>Click the link below to finish registration for <b>${locationName}</b>:</p>
                <a href="${link}">Complete registration</a><br>
                <p>This link will expire in 24 hrs.</p>
            `,
    });
    return true;
  } catch (err) {
    throw new AppError('Internal Server Error', 500);
  }
}

module.exports = {
  sendEmail,
  sendFindIdEmail,
  sendPasswordResetEmail,
  sendGuardianInviteEmail,
  sendCheckinEmail,
  sendManagerInviteEmail,
  verifyToken,
};

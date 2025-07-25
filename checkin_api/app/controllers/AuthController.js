const AuthService = require('../services/AuthService');
const EmailService = require('../services/EmailService');
const { validationResult } = require('express-validator');
const {
  updateUserValidation,
  userValidation,
  userSocialValidation,
} = require('../validations/validations');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await AuthService.login(username, password, req);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    const limiterInfo = req.rateLimit || {};

    res.status(500).json({
      success: false,
      message: err.message,
      attempts: limiterInfo.current || 0,
      remaining: limiterInfo.remaining || 5,
      isLocked: limiterInfo.remaining === 0,
      remainingTime: limiterInfo.remaining === 0 ? 5 * 60 : null,
    });
  }
};

exports.logout = async (req, res) => {
  await AuthService.logout(req.session, res);
  res.status(200).json({
    success: true,
  });
};

exports.validateRegistration = [
  userValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('AuthController/register: ', errors.array());

      const formattedErrors = errors.array().reduce((acc, error) => {
        const [field, message] = error.msg.split(': ');
        const fieldName = field.toLowerCase();

        acc[fieldName] = message || error.msg;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }
    return res.status(200).json({ success: true });
  },
];

exports.register = async (req, res) => {
  const { user, locationId } = req.body;
  const response = await AuthService.register(user, locationId);
  res.status(201).json({ success: true, user: response });
};

exports.getCurrentSession = async (req, res) => {
  try {
    const user = await AuthService.findCurrentSession(req.session);
    res.status(200).json({ success: true, user });
  } catch (err) {
    if (req.session && req.session.tempUser) {
      return res.status(200).json({
        success: true,
        user: null,
        tempUser: true,
      });
    }

    res.status(401).json({
      success: false,
    });
  }
};

exports.sendOTPEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
    });
  }
  const data = await EmailService.sendEmail(email);

  res.status(200).json({
    success: true,
    code: data.code,
    expiresIn: data.expiresIn,
    maxAttempts: data.maxAttempts,
  });
};

exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
    });
  }
  await AuthService.changePassword(userId, currentPassword, newPassword);

  res.status(200).json({
    success: true,
  });
};

exports.getUser = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
    });
  }
  const user = await AuthService.getUser(id);

  res.status(200).json({
    success: true,
    user,
  });
};

exports.updateUser = [
  updateUserValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().reduce((acc, error) => {
        const [field, message] = error.msg.split(': ');
        const fieldName = field.toLowerCase();
        acc[fieldName] = message || error.msg;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }
    const user = req.body;
    const response = await AuthService.updateUser(user);
    res.status(200).json({ success: true, user: response });
  },
];

// ---------------------------------------------------------
// Social login
// ---------------------------------------------------------

exports.authentication = async (req, res) => {
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
      phone: req.user.phone,
    };
    res.redirect(`${process.env.CORS_ORIGIN_URL}/main`);
  } else {
    res.redirect(`${process.env.CORS_ORIGIN_URL}/login`);
  }
};

exports.loginFailed = async (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Failed to login with social account.',
  });
};

exports.completeRegistration = [
  userSocialValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().reduce((acc, error) => {
        const [field, message] = error.msg.split(': ');
        const fieldName = field.toLowerCase();
        acc[fieldName] = message || error.msg;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }

    if (!req.body) {
      return res.status(400).json({
        success: false,
      });
    }
    await AuthService.completeRegistration(req);
    res.status(201).json({
      success: true,
      /*user: {
        id: newUser.id,
        username: newUser.username,
        engName: newUser.engName,
        role: newUser.role,
      },*/
    });
  },
];

// ---------------------------------------------------------
// Find ID/PW
// ---------------------------------------------------------

exports.handleFindRequest = async (req, res) => {
  const { email, searchType } = req.body;

  if (!email || !searchType) {
    res.status(400).json({
      success: false,
    });
  }
  await AuthService.handleFindRequest(email, searchType);
  res.status(200).json({ success: true });
};

exports.verifyUsername = async (req, res) => {
  const { token } = req.query;
  const decoded = EmailService.verifyToken(token);

  if (decoded.type !== 'findId') {
    res.status(400).json({ success: false, message: 'Invalid token type' });
  }

  const user = await AuthService.findUserByEmail(decoded.email);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    username: user.username,
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const decoded = EmailService.verifyToken(token);

  if (decoded.type !== 'resetPassword') {
    res.status(400).json({ success: false, message: 'Invalid token type' });
  }
  const updatedUser = await AuthService.updateUserByPassword(newPassword, decoded.email);

  res.status(200).json({
    success: true,
    updatedUser,
  });
};

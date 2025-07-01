const { body } = require('express-validator');
const AuthService = require('../services/AuthService');

const userValidation = [
  body('username').custom(async username => {
    const existingUsername = await AuthService.findUserByUsername(username);
    if (existingUsername) {
      return Promise.reject('Username: Username already exists.');
    }
  }),
  body('email').custom(async email => {
    const existingEmail = await AuthService.findUserByEmail(email);
    if (existingEmail) {
      return Promise.reject('Email: Email already exists.');
    }
  }),
  body('phone').custom(async phone => {
    const existingPhone = await AuthService.findUserByPhone(phone);
    if (existingPhone) {
      return Promise.reject('Phone: Phone number already exists.');
    }
  }),
];

const updateUserValidation = [
  body('username').custom(async (username, { req }) => {
    const existingUsername = await AuthService.findUserByUsername(username);
    if (existingUsername && existingUsername.id !== req.body.id) {
      return Promise.reject('Username: Username already exists.');
    }
  }),
  body('phone').custom(async (phone, { req }) => {
    const existingPhone = await AuthService.findUserByPhone(phone);
    if (existingPhone && existingPhone.id !== req.body.id) {
      return Promise.reject('Phone: Phone number already exists.');
    }
  }),
];

module.exports = {
  userValidation,
  updateUserValidation,
};

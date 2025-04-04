const {body} = require("express-validator");
const AuthService = require("../services/AuthService");

module.exports = userValidation = [
    body('username')
        .custom(async (username) => {
            const existingUsername = await AuthService.findUserByUsername(username);
            if(existingUsername) {
                return Promise.reject('Username: Username already exists.')
            }
        }),
    body('email')
        .custom(async (email) => {
            const existingEmail = await AuthService.findUserByEmail(email);
            if(existingEmail) {
                return Promise.reject('Email: Email already exists.')
            }
        })
];

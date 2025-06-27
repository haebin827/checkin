const express = require('express');
const router = express.Router();

const authRoutes = require('./AuthRoute');
const childRoutes = require('./ChildRoute');
const locationRoutes = require('./LocationRoute');
const qrRoutes = require('./QrRoutes');
const kakaoAuthRoutes = require('./KakaoAuthRoute');
const googleAuthRoutes = require('./GoogleAuthRoute');

module.exports = (app) => {
    authRoutes(app);
    childRoutes(app);
    locationRoutes(app);
    qrRoutes(app);
    kakaoAuthRoutes(app);
    googleAuthRoutes(app);
}; 
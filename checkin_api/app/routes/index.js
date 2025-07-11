const express = require('express');
const router = express.Router();

const authRoutes = require('./AuthRoute');
const childRoutes = require('./ChildRoute');
const locationRoutes = require('./LocationRoute');
const kakaoAuthRoutes = require('./KakaoAuthRoute');
const googleAuthRoutes = require('./GoogleAuthRoute');
const historyRoutes = require('./HistoryRoute');

module.exports = app => {
  authRoutes(app);
  childRoutes(app);
  locationRoutes(app);
  kakaoAuthRoutes(app);
  googleAuthRoutes(app);
  historyRoutes(app);
};

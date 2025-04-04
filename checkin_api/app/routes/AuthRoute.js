const auth = require("../controllers/AuthController")
const router = require("express").Router();
const loginAttemptTracker = require("../middlewares/loginAttemptTracker");

module.exports = (app) => {

    router.get('/', auth.getCurrentSession);

    router.post('/login', loginAttemptTracker, auth.login);

    router.post('/logout', auth.logout);

    router.post('/register', auth.register);

    router.post('/validate-registration', auth.validateRegistration);

    router.post('/opt-email', auth.sendOTPEmail);

    router.post('/find-account', auth.handleFindRequest);

    router.get('/verify-username', auth.verifyUsername);

    router.post('/reset-password', auth.resetPassword);

    app.use('/api/auth', router)
}
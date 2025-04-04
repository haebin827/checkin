const passport = require('../middlewares/passport');
const auth = require('../controllers/AuthController');
const router = require("express").Router();

module.exports = (app) => {

    router.get('/',
        passport.authenticate('kakao', {
            scope: ['profile_nickname', 'account_email'],
            prompt: 'login'
        })
    );

    router.get('/callback',
        passport.authenticate('kakao', {
            failureRedirect: '/login-failed'
        }), 
        auth.authentication
    );

    router.get('/login-failed', auth.loginFailed);

    app.use('/auth/kakao', router);
}; 
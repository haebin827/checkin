const passport = require('../middlewares/passport');
const auth = require('../controllers/AuthController');
const router = require("express").Router();

module.exports = (app) => {

    router.get('/',
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            prompt: 'select_account'
        })
    );

    router.get('/callback',
        passport.authenticate('google', {
            failureRedirect: '/login-failed'
        }),
        auth.authentication
    );

    router.get('/login-failed', auth.loginFailed);

    app.use('/auth/google', router);
};
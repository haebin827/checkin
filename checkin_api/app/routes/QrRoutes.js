const qrController = require('../controllers/QrController');
const User = require('../models/User');

module.exports = (app) => {
    app.post('/api/qr/verify', qrController.verifyUser);

    app.get('/api/qr/shared', qrController.generateSharedQr);

    app.get('/api/users', (req, res) => {
        try {
            const users = User.getAllUsers();
            return res.status(200).json({
                success: true,
                users: users
            });
        } catch (error) {
            console.error("사용자 목록 조회 오류:", error);
            return res.status(500).json({ message: "서버 오류가 발생했습니다" });
        }
    });
};
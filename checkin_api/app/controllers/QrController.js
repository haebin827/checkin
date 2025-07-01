const User = require('../models/User');
const QRCode = require('qrcode');

const SHARED_QR_ID = process.env.QR_ID;

// QR 코드로 사용자 확인
exports.verifyUser = async (req, res) => {
  // 요청으로부터 QR 코드 값을 추출
  const { qrCode, userId } = req.body;

  if (!qrCode) {
    return res.status(400).json({ message: 'QR 코드가 필요합니다' });
  }

  // 공유 QR 코드인지 확인
  if (qrCode !== SHARED_QR_ID) {
    return res.status(403).json({ message: '유효하지 않은 QR 코드입니다' });
  }

  // 요청에 userId가 포함되어 있는지 확인
  if (!userId) {
    return res.status(400).json({ message: '사용자 ID가 필요합니다' });
  }

  // 사용자 ID로 사용자 찾기
  const user = User.findUserById(userId);

  if (!user) {
    return res.status(404).json({ message: '유저를 찾을 수 없습니다' });
  }

  // 사용자 정보 반환 (비밀 정보는 제외)
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
    },
  });
};

// 공유 QR 코드 생성
exports.generateSharedQr = async (req, res) => {
  // QR 코드 이미지 생성
  const qrCodeDataUrl = await QRCode.toDataURL(SHARED_QR_ID);

  return res.status(200).json({
    success: true,
    qrCodeId: SHARED_QR_ID,
    qrCodeImage: qrCodeDataUrl,
  });
};

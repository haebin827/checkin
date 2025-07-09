// utils/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // 최소 로그 수준 (info 이상만 기록됨)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // ❗ error만 저장
    new transports.File({ filename: 'logs/combined.log' }), // ✅ 모든 로그 저장
  ],
});

// ✅ 개발 환경에서만 콘솔에도 출력
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
}

module.exports = logger;

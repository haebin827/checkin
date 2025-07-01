class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // 글로벌 핸들러에서 보일 메시지인지 여부
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;

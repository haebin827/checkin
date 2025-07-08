module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', err.stack);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
};

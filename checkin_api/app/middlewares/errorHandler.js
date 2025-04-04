module.exports = (err, req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        console.error("🚨 에러 발생:", err.stack);
    } else {
        console.error("🚨 에러 발생:", err.message);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server error'
    });
};
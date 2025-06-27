module.exports = (err, req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        console.error("🚨 Error:", err.stack);
    } else {
        console.error("🚨 Error:", err.message);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server error'
    });
};
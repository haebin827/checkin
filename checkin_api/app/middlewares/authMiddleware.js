exports.isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Login is required.',
    });
  }
  next();
};

exports.checkRole = requiredRole => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Login is required.',
      });
    }

    if (req.session.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    next();
  };
};

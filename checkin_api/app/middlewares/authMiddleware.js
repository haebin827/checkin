exports.isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Login is required.',
    });
  }
  next();
};

exports.checkRole = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Login is required.',
      });
    }

    const userRole = req.session.user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    next();
  };
};

function requirePermission(requiredPermission) {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const permissions = req.user.permissions || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions"
      });
    }

    next();
  };
}

module.exports = requirePermission;
const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: `Only ${role}s are allowed to access this resource` });
    }
    next();
};

module.exports = checkRole;

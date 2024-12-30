"use strict";

// /src/core/middlewares/authorization.mjs
import roles from "../configuration/roles.mjs";

const checkPermission = (role, action) => {
    if (!roles[role]) return false;
    return roles[role].can.includes(action);
};

/** Middleware to ensure the user has the right to perform specific actions or view certain data. */
const authorize = (action) => (req, res, next) => {
    const userRole = req.user?.role; // Assume `req.user` is populated via authentication
    if (!userRole) {
        return res.status(403).json({ error: "Role not specified" });
    }

    if (!checkPermission(userRole, action)) {
        return res.status(403).json({ error: "Permission denied" });
    }

    next();
};

export default authorize;
"use strict";

// /src/core/config/roles.mjs

const roles = {
    admin: {
        can: ["read", "write", "delete"],
    },
    user: {
        can: ["read", "write"],
    },
    guest: {
        can: ["read"],
    },
};

export default roles;
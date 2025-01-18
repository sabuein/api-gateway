"use strict";

import apiCall from "service";
import { addMessage } from "interface";

const signIn = async (username, password) => {
    const response = await apiCall("auth/login", "POST", {
        username,
        password,
    });

    if (response.token) {
        // Store the token securely
        localStorage.setItem("jwtToken", response.token);
    }

    return response;
};

const handleLogout = async () => {
    const form = "";
    const logout = await apiCall(form.action, form.method, {
        method: 'POST',
        credentials: 'include',
    });
    if (logout.status === 200) {
        localStorage.clear();
        alert('Logged out');
    } else {
        alert('Error logging out');
    }
};

export { signIn };
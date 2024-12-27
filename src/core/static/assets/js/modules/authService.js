// authService.js
import apiCall from "./apiService.js";

export async function signIn(username, password) {
  const response = await apiCall("auth/login", "POST", { username, password });

  if (response.token) {
    // Store the token securely
    localStorage.setItem("jwtToken", response.token);
  }

  return response;
}
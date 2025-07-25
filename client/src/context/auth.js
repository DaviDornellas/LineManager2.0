// src/context/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

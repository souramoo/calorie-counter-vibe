import jwtDecode from "jwt-decode";

// Check if token is valid (exists and not expired)
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Get expiration time from token
export const getTokenExpirationTime = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

// Get user ID from token
export const getUserIdFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

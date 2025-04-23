import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isAuthenticated,
  getCurrentUser,
  login,
  register,
  logout,
} from "../services/authService";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const handleLogin = async (credentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const handleRegister = async (userData) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Update user data
  const updateUserData = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));

    // Update in localStorage too
    const currentUser = getCurrentUser();
    if (currentUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          ...userData,
        })
      );
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

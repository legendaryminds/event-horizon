import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the AuthContext
export const AuthContext = createContext();

// Custom axios instance for authenticated requests
const authAxios = axios.create();

// Interceptor to add the token to the request headers
authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AuthProvider component definition
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Update Axios default headers when token changes
  useEffect(() => {
    if (token) {
      authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete authAxios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Signup function
  const signup = async (credentials) => {
    try {
      const res = await axios.post("/api/auth/signup", credentials);
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error during signup", error);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post("/api/auth/login", credentials);
      const { user, token } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

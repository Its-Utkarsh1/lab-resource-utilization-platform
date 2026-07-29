import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()



  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("jwtToken");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    console.log(response);

    localStorage.setItem("jwtToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const loggedInUser = {
      id: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
      institutionCode: response.institutionCode,
      institutionName: response.institutionName,
      departmentName: response.departmentName,
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    navigate("/dashboard");

    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);

    localStorage.setItem("jwtToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    localStorage.setItem("user", JSON.stringify(response.user));

    setUser(response.user);

    navigate("/dashboard");

    return response;
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  const oauthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    login,
    register,
    logout,
    oauthLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

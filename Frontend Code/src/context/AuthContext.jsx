import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  // =========================================================
  // RESTORE AUTHENTICATION
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("jwtToken");

    const storedUser =
      localStorage.getItem("user");

    console.log("AUTH RESTORE");
    console.log("Token exists:", !!token);
    console.log("Stored user:", storedUser);

    if (
      token &&
      storedUser &&
      storedUser !== "undefined"
    ) {

      try {

        const parsedUser =
          JSON.parse(storedUser);

        console.log(
          "Restored user:",
          parsedUser
        );

        setUser(parsedUser);

      } catch (error) {

        console.error(
          "Invalid stored user:",
          error
        );

        localStorage.removeItem(
          "jwtToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "user"
        );

        setUser(null);
      }

    } else {

      setUser(null);
    }

    setLoading(false);

  }, []);


  // =========================================================
  // NORMAL LOGIN
  // =========================================================

  const login = async (credentials) => {

    const response =
      await authService.login(
        credentials
      );

    console.log(
      "Login response:",
      response
    );

    localStorage.setItem(
      "jwtToken",
      response.accessToken
    );

    if (response.refreshToken) {

      localStorage.setItem(
        "refreshToken",
        response.refreshToken
      );
    }

    const loggedInUser = {

      id:
        response.userId,

      userId:
        response.userId,

      fullName:
        response.fullName,

      email:
        response.email,

      role:
        response.role,

      institutionCode:
        response.institutionCode ||
        null,

      institutionName:
        response.institutionName ||
        null,

      departmentName:
        response.departmentName ||
        null,

      emailVerified:
        response.emailVerified,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(
        loggedInUser
      )
    );

    setUser(loggedInUser);

    navigate(
      "/dashboard",
      {
        replace: true,
      }
    );

    return response;
  };


  // =========================================================
  // NORMAL REGISTRATION
  // =========================================================

  const register = async (userData) => {

    const response =
      await authService.register(
        userData
      );

    if (response.accessToken) {

      localStorage.setItem(
        "jwtToken",
        response.accessToken
      );
    }

    if (response.refreshToken) {

      localStorage.setItem(
        "refreshToken",
        response.refreshToken
      );
    }

    const registeredUser =
      response.user ||
      response;

    localStorage.setItem(
      "user",
      JSON.stringify(
        registeredUser
      )
    );

    setUser(
      registeredUser
    );

    navigate(
      "/dashboard",
      {
        replace: true,
      }
    );

    return response;
  };


  // =========================================================
  // GOOGLE LOGIN ONLY
  // =========================================================

  const oauthLogin = (provider) => {

    console.log(
      "Starting Google OAuth:",
      provider
    );

    window.location.href =
      `http://localhost:8080/oauth2/authorization/${provider}`;
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {

    localStorage.removeItem(
      "jwtToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  // =========================================================
  // CONTEXT
  // =========================================================

  const value = {

    user,

    setUser,

    isAuthenticated:
      !!user,

    isLoading:
      loading,

    login,

    register,

    logout,

    oauthLogin,
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};


// =========================================================
// useAuth
// =========================================================

export const useAuth = () => {

  const context =
    useContext(
      AuthContext
    );

  if (!context) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};


export default AuthContext;
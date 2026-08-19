import React, { useEffect, useRef } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://lab-resource-utilization-platform-1.onrender.com";

const OAuthSuccessPage = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const { setUser } = useAuth();

  const processedRef = useRef(false);

  useEffect(() => {

    if (processedRef.current) {
      return;
    }

    processedRef.current = true;

    const completeGoogleLogin = async () => {

      console.log(
        "========== GOOGLE OAUTH =========="
      );

      const token =
        searchParams.get("token");

      console.log(
        "OAuth token exists:",
        !!token
      );

      if (!token) {

        console.error(
          "OAuth token is missing"
        );

        toast.error(
          "Google login failed."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {

        // ---------------------------------------------
        // SAVE TOKEN
        // ---------------------------------------------

        localStorage.setItem(
          "jwtToken",
          token
        );

        // ---------------------------------------------
        // GET CURRENT USER
        // ---------------------------------------------

        const response =
          await axios.get(
            `${API_BASE_URL}/api/auth/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "/api/auth/me response:",
          response.data
        );

        const data =
          response.data;

        // ---------------------------------------------
        // BUILD USER OBJECT
        // ---------------------------------------------

        const loggedInUser = {

          id:
            data.userId ?? null,

          userId:
            data.userId ?? null,

          fullName:
            data.fullName ?? "",

          email:
            data.email ?? "",

          role:
            data.role ?? "",

          institutionCode:
            data.institutionCode ?? null,

          institutionName:
            data.institution ??
            data.institutionName ??
            null,

          departmentName:
            data.department ??
            data.departmentName ??
            null,

          emailVerified:
            data.emailVerified ?? false,

          phoneNumber:
            data.phoneNumber ?? null,
        };

        console.log(
          "OAuth user:",
          loggedInUser
        );

        // ---------------------------------------------
        // SAVE USER
        // ---------------------------------------------

        localStorage.setItem(
          "user",
          JSON.stringify(
            loggedInUser
          )
        );

        // ---------------------------------------------
        // UPDATE AUTH CONTEXT
        // ---------------------------------------------

        setUser(loggedInUser);

        console.log(
          "Authentication state updated"
        );

        // ---------------------------------------------
        // REDIRECT
        // ---------------------------------------------

        toast.success(
          "Google login successful"
        );

        navigate("/", {
          replace: true,
        });

      } catch (error) {

        console.error(
          "========== GOOGLE OAUTH ERROR =========="
        );

        console.error(error);

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
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

        toast.error(
          "Unable to complete Google login."
        );

        navigate("/login", {
          replace: true,
        });
      }
    };

    completeGoogleLogin();

  }, [
    navigate,
    searchParams,
    setUser,
  ]);

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center">

      <div className="text-center">

        <div
          className="
            w-12
            h-12
            border-4
            border-[#D8D3C7]
            border-t-[#1F7A6C]
            rounded-full
            animate-spin
            mx-auto
            mb-5
          "
        />

        <h1 className="text-xl font-black text-[#14181C]">
          Signing you in...
        </h1>

        <p className="text-sm text-[#5B6770] mt-2">
          Completing Google authentication
        </p>

      </div>

    </div>
  );
};

export default OAuthSuccessPage;
import React from "react";

import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../../hooks/useAuth";

const ProtectedRoute = ({
  children,
  allowedRoles
}) => {

  const {
    isAuthenticated,
    isLoading,
    user
  } = useAuth();

  console.log(
    "ProtectedRoute user:",
    user
  );

  console.log(
    "ProtectedRoute authenticated:",
    isAuthenticated
  );

  console.log(
    "ProtectedRoute loading:",
    isLoading
  );

  if (isLoading) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {

    console.log(
      "ProtectedRoute: NOT AUTHENTICATED"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!allowedRoles) {

    return children;
  }

  const role =
    user?.role?.roleName ??
    user?.roleName ??
    user?.role;

  console.log(
    "Resolved role:",
    role
  );

  if (
    !allowedRoles.includes(role)
  ) {

    console.log(
      "Access denied for role:",
      role
    );

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log("User:", user);
  console.log("Allowed Roles:", allowedRoles);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles) {
    return children;
  }

  const role =
    user?.role?.roleName ??
    user?.roleName ??
    user?.role;

  console.log("Resolved Role:", role);

  if (!allowedRoles.includes(role)) {
    console.log("Access Denied");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // ✅ Updated key from "token" to "access"
  const accessToken = localStorage.getItem("access");
  const refreshToken = localStorage.getItem("refresh");

  const isLoggedIn = !!accessToken && !!refreshToken;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

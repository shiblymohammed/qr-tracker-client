import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../services/auth";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

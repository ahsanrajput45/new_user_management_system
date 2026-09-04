import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export default function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/users" replace />;
  }

  return <Outlet />;
}

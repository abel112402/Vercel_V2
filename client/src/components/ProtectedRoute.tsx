import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn, selectUserRole } from "../state/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  guestOnly?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute = ({
  children,
  requireAdmin,
  guestOnly,
  fallbackPath = "/login",
}: ProtectedRouteProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(selectUserRole);

  if (guestOnly && isLoggedIn) {
    return <Navigate to="/tables" replace />;
  }

  if (!isLoggedIn && !guestOnly) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/tables" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

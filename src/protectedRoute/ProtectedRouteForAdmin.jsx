import { Navigate } from "react-router";

export const ProtectedRouteForAdmin = ({ children }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("users"));
  } catch (e) {
    user = null;
  }

  if (user?.role === "admin") {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

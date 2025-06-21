import { Navigate } from "react-router";

export const ProtectedRouteForUser = ({ children }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("users"));
  } catch (e) {
    user = null;
  }

  if (user?.role === "user") {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

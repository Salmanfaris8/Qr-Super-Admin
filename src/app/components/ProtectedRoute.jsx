import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("token"); // or your auth logic

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
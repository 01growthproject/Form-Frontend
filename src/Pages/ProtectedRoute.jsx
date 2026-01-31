import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// 5 minutes timeout (same as Login)
const SESSION_TIMEOUT = 12 * 60 * 60 * 1000;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");

  // No token OR no login time → redirect
  if (!token || !loginTime) {
    return <Navigate to="/login" replace />;
  }

  // Check custom 5-minute session timeout
  const timeElapsed = Date.now() - parseInt(loginTime);
  if (timeElapsed >= SESSION_TIMEOUT) {
    console.log("🕐 Custom session expired after 5 minutes");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    toast.warning("🔒 Session expired after 5 minutes! Please login again.");
    return <Navigate to="/login" replace />;
  }

  // Optional: Also check JWT expiry (keep your existing logic)
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
      console.log("JWT token expired");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      toast.warning("Session expired, please login again");
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

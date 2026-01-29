import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Check if token exists and is valid
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Verify token is not expired (if using JWT)
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));


    if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {

      console.log("token expired");

      localStorage.removeItem("token");
      localStorage.removeItem("user");


      toast.warning("session expired, please login")

      return <Navigate to="/login" replace />;
    }


    return children;


  } catch (error) {

    console.error("Invalid token format");

    localStorage.removeItem("token");
    localStorage.removeItem("user")



    return <Navigate to="/login" replace />;
  }

};

export default ProtectedRoute;
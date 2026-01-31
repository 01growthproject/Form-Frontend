



import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing.jsx";
import Login from "./Pages/Login.jsx";
// import Signup from "./Pages/Signup.jsx";
import Home from "./Pages/Home.jsx";
import Form from "./Pages/Form.jsx";
import Admin from "./Components/Admin/Admin.jsx";
import ClientDetail from "./Components/Admin/ClientDetail.jsx";

import ProtectedRoute from "./Pages/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/client/:id"
          element={
            <ProtectedRoute>
              <ClientDetail />
            </ProtectedRoute>
          }
        />

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1500} theme="light" />
    </>
  );
};

export default App;
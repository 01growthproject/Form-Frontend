import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx"; // 👈 Import this
import "./Styles/Home.css";

const HomeContent = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>📋 Growth Client Management</h1>
            <p>Streamline your client registration and data management process</p>
            <div className="hero-buttons">
              <Link to="/form" className="btn btn-primary">
                ➕ Register New Client
              </Link>
              <Link to="/admin" className="btn btn-secondary">
                👥 View All Users
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Fast & Easy</h3>
              <p>Quick client registration with intuitive forms</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Secure</h3>
              <p>Your data is protected with enterprise-grade security</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Analytics</h3>
              <p>Real-time insights and comprehensive reports</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌐</span>
              <h3>Global</h3>
              <p>Support for clients from around the world</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Wrap with ProtectedRoute
const Home = () => {
  return <ProtectedRoute>{<HomeContent />}</ProtectedRoute>;
};

export default Home;

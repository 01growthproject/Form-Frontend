import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h3>🏢 Growth Client</h3>
                </div>

                <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
                    <Link to="/home" className="nav-link">📊 Home</Link>
                    <Link to="/form" className="nav-link">📝 Form</Link>
                    <Link to="/admin" className="nav-link">👥 All Users</Link>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>

                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

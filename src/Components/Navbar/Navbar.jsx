import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const navItems = [
        { path: "/home", label: "Dashboard", icon: "📊" },
        { path: "/form", label: "Register", icon: "📝" },
        { path: "/admin", label: "Users", icon: "👥" },
    ];

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                {/* Logo */}
                <div className="nav-logo" onClick={() => navigate("/home")}>
                    <img src="/logo.jpg" alt="Logo" className="nav-logo-img" />
                    <div className="nav-logo-text">
                        {/* <h2>Growth Overseas</h2>
                        <span>International Edutech</span> */}
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="nav-links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            <span className="nav-indicator"></span>
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <button 
                    className="logout-btn"
                    onClick={logout}
                    title="Logout"
                >
                    <span className="logout-icon">↪</span>
                    <span className="logout-text">Logout</span>
                </button>

                {/* Mobile Menu Toggle */}
                <button 
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-header">
                        <div className="mobile-logo">
                            <img src="/logo.jpg" alt="Logo" className="mobile-logo-img" />
                            <div className="mobile-logo-text">
                                <span>Growth Overseas</span>
                                <span>International Edutech</span>
                            </div>
                        </div>
                        <button 
                            className="close-menu"
                            onClick={() => setMenuOpen(false)}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="mobile-links">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={handleNavClick}
                            >
                                <span className="mobile-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        
                        <button 
                            className="mobile-logout"
                            onClick={logout}
                        >
                            <span className="mobile-logout-icon">↪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Overlay */}
                {menuOpen && (
                    <div 
                        className="menu-overlay"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
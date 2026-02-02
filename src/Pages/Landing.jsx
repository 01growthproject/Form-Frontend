import React from "react";
import { Link } from "react-router-dom";
import "../Pages/Styles/Landing.css";

const Landing = () => {
  return (
    <div className="landing-wrapper">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.jpg" alt="Logo" className="nav-logo-img" />
            {/* <div className="nav-logo-text">
              <h2>Growth Overseas</h2>
              <span>International Edutech</span>
            </div> */}
          </div>
          <Link to="/login" className="nav-login-btn">
            Login
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span className="badge-text">Professional Client Management System</span>
            </div>

            <h1 className="hero-title">
              Transform Your
              <span className="hero-title-gradient"> International Education Journey</span>
            </h1>

            <p className="hero-subtitle">
              Streamline your global education consulting with our secure, fast, and intuitive platform designed specifically for education consultants and agencies.
            </p>

            <div className="hero-cta">
              <Link to="/login" className="cta-primary">
                <span className="cta-icon">🚀</span>
                <span className="cta-text">
                  <span className="cta-title">Get Started</span>
                  <span className="cta-subtitle">Access Dashboard</span>
                </span>
                <span className="cta-arrow">→</span>
              </Link>

              <div className="hero-stats-container">
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">⚡</span>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">Fast</span>
                    <span className="stat-label">Setup</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">🔒</span>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">Secure</span>
                    <span className="stat-label">Data Protection</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">🌐</span>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">Global</span>
                    <span className="stat-label">Reach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card main-card">
              <div className="card-header">
                <div className="card-icon">🎓</div>
                <div className="card-badge">Live</div>
              </div>
              <div className="visual-content">
                <h3>Client Management Portal</h3>
                <p>Efficiently manage student registrations, track applications, and streamline your workflow</p>
                <div className="card-features">
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    <span>Real-time Updates</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    <span>Secure Storage</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    <span>Easy Access</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-card card-1">
              <div className="mini-icon">📊</div>
              <div className="mini-text">
                <span className="mini-title">Analytics</span>
                <span className="mini-subtitle">Track Progress</span>
              </div>
            </div>
            
            <div className="floating-card card-2">
              <div className="mini-icon">📝</div>
              <div className="mini-text">
                <span className="mini-title">Forms</span>
                <span className="mini-subtitle">Quick Register</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-icon">🌍</span>
                <div className="footer-logo-text">
                  <h3>Growth Overseas</h3>
                  <span>International Edutech</span>
                </div>
              </div>
              <p className="footer-tagline">
                Empowering dreams • Connecting futures • Building success
              </p>
              <p className="footer-copyright">
                © 2018 Growth Overseas International Edutech. All rights reserved.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <Link to="/login">Admin Login</Link>
              </div>

              <div className="footer-column">
                <h4>Contact</h4>
                <p>📞 +91 98545 90005</p>
                <p>📍 Zirakpur, Punjab</p>
                <p>🌐 Ambala-Chandigarh Expy</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
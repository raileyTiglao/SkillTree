import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/header.css";


const Header = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="header-logo-icon" />
        <Link to="/" className="header-logo-text">SkillTree</Link>
      </div>

      <div className="nav-links">
        <Link
          to="/about"
          className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
        >
          About SkillTree
        </Link>
        <Link
          to="/contents"
          className={`nav-link ${location.pathname === "/contents" ? "active" : ""}`}
        >
          Contents
        </Link>
        <Link
          to="/login"
          className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
        >
          Log-in
        </Link>
        <Link
          to="/signup"
          className={`signup-btn ${location.pathname === "/signup" ? "active" : ""}`}
        >
          <span>Sign-Up</span>
          <div className="btn-glow" />
        </Link>
      </div>
    </nav>
  );
};

export default Header;

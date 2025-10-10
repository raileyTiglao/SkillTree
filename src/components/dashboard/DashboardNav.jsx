// src/components/dashboard/DashboardNav.jsx
import React from 'react';

function DashboardNav({ user, userProgress, onLogout }) {
  return (
    <nav className="dashboard-navbar">
      <div className="logo-container">
        <div className="logo-icon"></div>
        <span className="logo-text">SkillTree</span>
      </div>
      <div className="nav-center">
        <span className="welcome-text">
          Welcome back, {user.displayName || user.email.split('@')[0]}!
        </span>
      </div>
      <div className="nav-actions">
        <div className="user-level">Level {userProgress.level}</div>
        <button className="logout-btn" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export default DashboardNav;
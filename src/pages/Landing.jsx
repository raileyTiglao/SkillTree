import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import '../styles/landing.css';

const Landing = () => {
  return (
    <div>
      <Header />
      
      <div className="landing-page">
        {/* Background decorations */}
        <div className="bg-decorations">
          <div className="bg-decoration bg-decoration-1"></div>
          <div className="bg-decoration bg-decoration-2"></div>
          <div className="bg-decoration bg-decoration-3"></div>
        </div>
        
        <div className="landing-content">
          <div className="content-grid">
            {/* Left content */}
            <div className="text-content">
              <h1 className="main-heading">
                <span className="heading-white">ComSci? Go for </span>
                <span className="heading-gradient">Back-end!</span>
              </h1>
              
              <h2 className="sub-heading">Welcome to SkillTree!</h2>
              
              <p className="description">
                This can be your first step into the world of backend programming! Our platform is designed for 
                beginners who want to learn how websites and apps really work behind the scenes. From handling 
                databases and APIs to building secure servers and scalable applications, we break down complex 
                concepts into simple, practical lessons.
              </p>
              
              <button className="cta-button">
                Get Started
              </button>
            </div>
            
            {/* Right content - 3D illustration */}
            <div className="illustration-container">
              <div className="server-illustration">
                {/* Database/Server illustration */}
                <div className="server-stack">
                  {/* Main server stack */}
                  <div className="server-main">
                    <div className="server-inner"></div>
                    {/* Server layers */}
                    <div className="server-layer server-layer-1"></div>
                    <div className="server-layer server-layer-2"></div>
                    <div className="server-layer server-layer-3"></div>
                    <div className="server-layer server-layer-4"></div>
                    
                    {/* Database cylinder representation */}
                    <div className="database-cylinder database-cylinder-1"></div>
                    <div className="database-cylinder database-cylinder-2"></div>
                  </div>
                  
                  {/* Floating code blocks */}
                  <div className="floating-block api-block">
                    <div className="block-text">API</div>
                  </div>
                  <div className="floating-block db-block">
                    <div className="block-text">DB</div>
                  </div>
                  <div className="floating-block extra-block"></div>
                  
                  {/* Connection lines */}
                  <div className="connection-line line-right"></div>
                  <div className="connection-line line-left"></div>
                  <div className="connection-line line-top"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

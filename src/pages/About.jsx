// src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Background orbs matching dashboard aesthetic */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation Header */}
      <nav className="about-nav">
        <div className="nav-content">
          <h2 className="logo-text">SkillForge</h2>
          <button onClick={() => navigate('/')} className="nav-back-btn">
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="about-title">
            Forge Your Skills,<br />
            Shape Your Future
          </h1>
          <p className="about-subtitle">
            A gamified learning platform designed to transform the way you master technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="section-content">
          <div className="section-icon">🎯</div>
          <h2 className="section-heading">Our Mission</h2>
          <p className="section-text">
            SkillForge was created with a simple yet powerful vision: to make learning technology 
            skills engaging, structured, and rewarding. We believe that everyone should have access 
            to quality tech education that feels less like studying and more like leveling up in your 
            favorite game.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-heading">Why SkillForge?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Gamified Learning</h3>
            <p>
              Earn XP, level up, and track your progress with an engaging system that makes 
              learning addictive in the best way possible.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Structured Curriculum</h3>
            <p>
              Follow carefully designed learning paths from beginner to advanced, ensuring 
              you build a solid foundation before tackling complex topics.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Progressive Unlocking</h3>
            <p>
              Skills unlock sequentially, preventing you from jumping ahead and ensuring you 
              master fundamentals before moving forward.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Achievement System</h3>
            <p>
              Celebrate your progress with certifications, streaks, and milestones that 
              validate your hard work and dedication.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Multiple Disciplines</h3>
            <p>
              Choose from Frontend, Backend, UI/UX Design, and DevOps categories, or master 
              them all to become a full-stack expert.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Your Growth</h3>
            <p>
              Visualize your learning journey with detailed progress tracking, completion 
              stats, and personalized insights.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="about-section">
        <h2 className="section-heading">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Choose Your Path</h3>
            <p>Select from multiple skill categories that align with your career goals and interests.</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Complete Modules</h3>
            <p>Work through structured modules, from beginner concepts to advanced techniques.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Earn XP & Level Up</h3>
            <p>Gain experience points for each completed skill and watch your level rise.</p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Get Certified</h3>
            <p>Unlock certifications as you complete categories and demonstrate mastery.</p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about-section philosophy-section">
        <div className="section-content">
          <div className="section-icon">💡</div>
          <h2 className="section-heading">Our Philosophy</h2>
          <p className="section-text">
            We believe that learning should be:
          </p>
          <ul className="philosophy-list">
            <li><strong>Engaging:</strong> Every skill completed should feel like a victory</li>
            <li><strong>Structured:</strong> Clear paths prevent overwhelm and confusion</li>
            <li><strong>Rewarding:</strong> Your progress should be visible and celebrated</li>
            <li><strong>Flexible:</strong> Learn at your own pace, on your own schedule</li>
            <li><strong>Comprehensive:</strong> Quality resources that actually teach, not just list topics</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of learners leveling up their tech skills</p>
          <button onClick={() => navigate('/signup')} className="cta-button">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>© 2025 SkillForge. Built with passion for learners everywhere.</p>
      </footer>
    </div>
  );
};

export default About;
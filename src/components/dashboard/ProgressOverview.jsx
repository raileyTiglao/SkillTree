// src/components/dashboard/ProgressOverview.jsx
import React from 'react';

const ProgressOverview = ({ 
  userProgress, 
  onAddCategory, 
  onShowCertifications,
  categories = [],
  completedSkills = new Set()
}) => {
  // Calculate progress based on currently selected categories only
  const getCurrentCategoryProgress = () => {
    if (!categories || categories.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    // Get all skills from currently selected categories
    const allCurrentSkills = categories.flatMap(cat => cat.skills || []);
    const totalSkills = allCurrentSkills.length;
    
    // Count only completed skills that are in current categories
    const completedCount = allCurrentSkills.filter(skill => 
      completedSkills.has(skill.id)
    ).length;

    const percentage = totalSkills > 0 ? (completedCount / totalSkills) * 100 : 0;

    return {
      completed: completedCount,
      total: totalSkills,
      percentage: Math.min(percentage, 100)
    };
  };

  const currentProgress = getCurrentCategoryProgress();
  const remainingSkills = Math.max(currentProgress.total - currentProgress.completed, 0);

  return (
    <section className="progress-overview">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title">Your Progress</h2>
        <button 
          className="add-category-btn"
          onClick={onAddCategory}
        >
          + Add Skill Categories
        </button>
      </div>

      <div className="progress-cards">
        {/* Overall Progress Card */}
        <div className="progress-card main-progress">
          <div className="progress-header">
            <h3>Current Categories Progress</h3>
            <span className="progress-percentage">
              {Math.round(currentProgress.percentage)}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${currentProgress.percentage}%`,
                transition: 'width 0.8s ease'
              }}
            ></div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <p className="progress-text">
              <strong>{currentProgress.completed}</strong> of <strong>{currentProgress.total}</strong> skills completed
            </p>
            {remainingSkills > 0 && (
              <p className="progress-text" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {remainingSkills} remaining
              </p>
            )}
          </div>
          
          {/* Completion Message */}
          {currentProgress.percentage === 100 && currentProgress.total > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#4caf50', fontWeight: 600 }}>
                🎉 All current category skills completed! Add more categories to continue learning.
              </span>
            </div>
          )}

          {/* No Categories Message */}
          {currentProgress.total === 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#667eea', fontWeight: 600 }}>
                📚 Select categories to start your learning journey!
              </span>
            </div>
          )}
        </div>

        {/* Certification Button */}
        <div style={{ marginTop: '2rem' }}>
          <button
            className="certification-btn"
            onClick={onShowCertifications}
          >
            🏅 See Eligible Certifications
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h4>Level {userProgress.level}</h4>
              <p>Current Level</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h4>{userProgress.experience.toLocaleString()} XP</h4>
              <p>Total Experience</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h4>{userProgress.streak} {userProgress.streak === 1 ? 'day' : 'days'}</h4>
              <p>Learning Streak</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressOverview;
// src/components/dashboard/SkillCategories.jsx
import React from 'react';

const SkillCategories = ({ 
  categories, 
  completedSkills, 
  completedAssessments,
  onSkillClick, 
  onStartQuiz,
  arePrerequisitesMet,
  getDifficultyColor,
  onShowCategorySelector
}) => {
  // Difficulty sorting function
  const sortSkillsByDifficulty = (skills) => {
    const difficultyOrder = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3
    };
    
    return [...skills].sort((a, b) => {
      const orderA = difficultyOrder[a.difficulty] || 999;
      const orderB = difficultyOrder[b.difficulty] || 999;
      return orderA - orderB;
    });
  };

  // Check if a skill is unlocked based on previous skill completion
  const isSkillUnlocked = (skillIndex, sortedSkills) => {
    // First skill is always unlocked
    if (skillIndex === 0) return true;
    
    // Check if previous skill is completed
    const previousSkill = sortedSkills[skillIndex - 1];
    return completedSkills.has(previousSkill.id);
  };

  if (categories.length === 0) {
    return (
      <section className="skills-section">
        <h2 className="section-title">Your Skill Categories</h2>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          marginTop: '2rem'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            No skill categories selected yet.
          </p>
          <button 
            onClick={onShowCategorySelector}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}
          >
            Choose Your First Category
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="skills-section">
      <h2 className="section-title">Your Skill Categories</h2>
      
      <div className="categories-grid">
        {categories.map(category => {
          // Sort skills by difficulty for this category
          const sortedSkills = sortSkillsByDifficulty(category.skills);
          
          return (
            <div
              key={category.id}
              className="category-card"
              style={{ '--category-gradient': category.color }}
            >
              <div className="category-header">
                <h3 className="category-title">{category.title}</h3>
                <span className="category-progress">
                  {category.skills.filter(skill => completedSkills.has(skill.id)).length}/{category.skills.length}
                </span>
              </div>

              {/* Skills Grid - Now sorted by difficulty with progression locks */}
              <div className="skills-grid">
                {sortedSkills.map((skill, index) => {
                  const isUnlocked = isSkillUnlocked(index, sortedSkills);
                  const isCompleted = completedSkills.has(skill.id);
                  
                  return (
                    <div
                      key={skill.id}
                      className={`skill-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                      onClick={() => isUnlocked ? onSkillClick(skill) : null}
                      style={{
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.5
                      }}
                    >
                      {!isUnlocked && (
                        <div className="lock-overlay">
                          <svg 
                            width="40" 
                            height="40" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            style={{ color: '#94a3b8' }}
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          <p style={{ 
                            marginTop: '0.5rem', 
                            fontSize: '0.85rem', 
                            color: '#94a3b8',
                            fontWeight: '500'
                          }}>
                            Complete previous skill to unlock
                          </p>
                        </div>
                      )}
                      
                      <div className="skill-header">
                        <h4 className="skill-name">{skill.name}</h4>
                        <span
                          className="skill-difficulty"
                          style={{ color: getDifficultyColor(skill.difficulty) }}
                        >
                          {skill.difficulty}
                        </span>
                      </div>
                      <p className="skill-description">{skill.description}</p>
                      <div className="skill-footer">
                        <span className="skill-xp">{skill.xp} XP</span>
                        {isCompleted && (
                          <span className="skill-completed-badge">✅</span>
                        )}
                        {!isUnlocked && !isCompleted && (
                          <span style={{ fontSize: '1.2rem' }}></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assessments Section */}
              {category.assessments && category.assessments.length > 0 && (
                <div className="assessments-section">
                  <h4 className="assessments-title">Assessments</h4>
                  <div className="assessments-grid">
                    {category.assessments.map(assessment => {
                      const isUnlocked = arePrerequisitesMet(assessment.prerequisites);
                      const isCompleted = completedAssessments.has(assessment.id);
                      
                      return (
                        <div
                          key={assessment.id}
                          className={`assessment-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                          onClick={() => isUnlocked && !isCompleted ? onStartQuiz(assessment) : null}
                        >
                          <div className="assessment-header">
                            <h5 className="assessment-name">{assessment.name}</h5>
                            <div className="assessment-status">
                              {!isUnlocked && <span className="lock-icon">🔒</span>}
                              {isCompleted && <span className="completed-badge">✅</span>}
                              {isUnlocked && !isCompleted && <span className="available-badge">📝</span>}
                            </div>
                          </div>
                          <p className="assessment-description">{assessment.description}</p>
                          <div className="assessment-footer">
                            <span className="assessment-xp">{assessment.xp} XP</span>
                            <span 
                              className="assessment-difficulty"
                              style={{ color: getDifficultyColor(assessment.difficulty) }}
                            >
                              {assessment.difficulty}
                            </span>
                          </div>
                          {!isUnlocked && (
                            <div className="prerequisites-info">
                              <small>Complete required skills first</small>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillCategories;
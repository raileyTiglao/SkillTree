// src/components/dashboard/SkillDetailModal.jsx
import React from 'react';

const SkillDetailModal = ({ 
  skill, 
  onClose, 
  completedSkills, 
  onComplete, 
  getDifficultyColor,
  timer,
  onStartTimer
}) => {
  if (!skill) return null;

  const isCompleted = completedSkills.has(skill.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{skill.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-difficulty">
            <strong>Difficulty: </strong>
            <span style={{ color: getDifficultyColor(skill.difficulty) }}>
              {skill.difficulty}
            </span>
          </div>
          <p className="modal-description">{skill.description}</p>
          <p className="modal-xp">Reward: {skill.xp} XP</p>

          {/* Reference Link as Button */}
          {skill.Reference && (
            <a
              href={skill.Reference}
              target="_blank"
              rel="noopener noreferrer"
              className="module-btn"
              onClick={onStartTimer}
            >
              📚 Check out this Module!
            </a>
          )}

          {!isCompleted && (
            <button
              className="complete-skill-btn"
              onClick={() => onComplete(skill.id)}
              disabled={timer > 0}
            >
              {timer > 0 
                ? `Please wait ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                : "Mark as Complete"}
            </button>
          )}
          
          {isCompleted && (
            <div className="skill-completed-message">
              🎉 Skill Completed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;
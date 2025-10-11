// src/components/dashboard/CertificationDetailModal.jsx
import React from 'react';

const CertificationDetailModal = ({ 
  certification, 
  onClose, 
  getDifficultyColor 
}) => {
  if (!certification) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{certification.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="cert-detail-image">
            <img 
              src={certification.image} 
              alt={certification.name}
              style={{ width: '150px', height: 'auto', margin: '0 auto', display: 'block' }}
            />
          </div>
          
          <div className="cert-provider-badge">
            <strong>Provider:</strong> {certification.provider}
          </div>
          
          <div className="modal-difficulty">
            <strong>Difficulty: </strong>
            <span style={{ color: getDifficultyColor(certification.difficulty) }}>
              {certification.difficulty}
            </span>
          </div>
          
          <p className="modal-description">{certification.description}</p>

          <a
            href={certification.url}
            target="_blank"
            rel="noopener noreferrer"
            className="complete-skill-btn"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              marginTop: '1.5rem'
            }}
          >
            Take Certification Exam
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificationDetailModal;
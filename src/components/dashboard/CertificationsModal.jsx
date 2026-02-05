// src/components/dashboard/CertificationsModal.jsx
import React from 'react';

const CertificationsModal = ({ 
  show, 
  onClose, 
  certifications, 
  areCertPrerequisitesMet,
  onSelectCertification,
  getDifficultyColor
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="certifications-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Available Certifications</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="certifications-grid">
          {certifications.map(cert => {
            const isEligible = areCertPrerequisitesMet(cert.prerequisites);
            
            return (
              <div
                key={cert.id}
                className={`certification-card ${!isEligible ? 'locked' : ''}`}
                onClick={() => isEligible && onSelectCertification(cert)}
              >
                <div className="cert-image-container">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className={`cert-image ${!isEligible ? 'grayscale' : ''}`}
                  />
                  {!isEligible && (
                    <div className="cert-lock-overlay">
                      <span className="lock-icon-large">🔒</span>
                    </div>
                  )}
                </div>
                
                <div className="cert-content">
                  <h4 className="cert-name">{cert.name}</h4>
                  <p className="cert-provider">{cert.provider}</p>
                  <span 
                    className="cert-difficulty"
                    style={{ color: getDifficultyColor(cert.difficulty) }}
                  >
                    {cert.difficulty}
                  </span>
                  
                  {!isEligible && (
                    <p className="cert-locked-text">
                      Complete required skills to unlock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CertificationsModal;
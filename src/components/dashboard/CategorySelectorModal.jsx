// src/components/dashboard/CategorySelectorModal.jsx
import React from 'react';

const CategorySelectorModal = ({ 
  show, 
  onClose, 
  allCategories, 
  selectedCategories, 
  onCategoryToggle 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="category-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Choose Skill Categories</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          <p style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>
            Select the skill categories you want to focus on:
          </p>
          <div className="category-options">
            {allCategories.map(category => (
              <div
                key={category.id}
                className={`category-option ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                data-category={category.id}
                onClick={() => onCategoryToggle(category.id)}
              >
                <div className="category-option-header">
                  <h4>{category.title}</h4>
                  <div className="category-skills-count">
                    {category.skills?.length || 0} skills
                  </div>
                </div>
                <p className="category-description">{category.description}</p>
                <div className="selection-indicator">
                  {selectedCategories.includes(category.id) ? '✅' : '⭕'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectorModal;
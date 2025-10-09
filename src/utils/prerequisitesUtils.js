// src/utils/prerequisitesUtils.js

/**
 * Check if all prerequisites are met for an assessment
 * @param {Array} prerequisites - Array of prerequisite IDs (can be strings or numbers)
 * @param {Set} completedSkills - Set of completed skill IDs
 * @param {Set} completedAssessments - Set of completed assessment IDs
 * @returns {boolean} True if all prerequisites are met
 */
export function arePrerequisitesMet(prerequisites, completedSkills, completedAssessments) {
  return prerequisites.every(prereq => {
    if (typeof prereq === 'string') {
      // It's an assessment prerequisite
      return completedAssessments.has(prereq);
    } else {
      // It's a skill prerequisite
      return completedSkills.has(prereq);
    }
  });
}

/**
 * Check if certification prerequisites are met
 * @param {Array} prerequisites - Array of skill IDs required
 * @param {Set} completedSkills - Set of completed skill IDs
 * @returns {boolean} True if all prerequisites are met
 */
export function areCertPrerequisitesMet(prerequisites, completedSkills) {
  return prerequisites.every(skillId => completedSkills.has(skillId));
}

/**
 * Get missing prerequisites
 * @param {Array} prerequisites - Array of prerequisite IDs
 * @param {Set} completedSkills - Set of completed skill IDs
 * @returns {Array} Array of missing prerequisite IDs
 */
export function getMissingPrerequisites(prerequisites, completedSkills) {
  return prerequisites.filter(prereq => !completedSkills.has(prereq));
}
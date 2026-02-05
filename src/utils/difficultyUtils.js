// src/utils/difficultyUtils.js

/**
 * Get color code for difficulty level
 * @param {string} difficulty - Difficulty level (Beginner, Intermediate, Advanced)
 * @returns {string} Color hex code
 */
export function getDifficultyColor(difficulty) {
  const colors = {
    Beginner: "#4caf50",
    Intermediate: "#ff9800",
    Advanced: "#f44336"
  };
  
  return colors[difficulty] || "#64ffda";
}

/**
 * Get badge emoji for difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {string} Emoji
 */
export function getDifficultyBadge(difficulty) {
  const badges = {
    Beginner: "🟢",
    Intermediate: "🟡",
    Advanced: "🔴"
  };
  
  return badges[difficulty] || "⚪";
}

/**
 * Sort items by difficulty level
 * @param {Array} items - Array of items with difficulty property
 * @returns {Array} Sorted array
 */
export function sortByDifficulty(items) {
  const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  
  return [...items].sort((a, b) => {
    return (order[a.difficulty] || 99) - (order[b.difficulty] || 99);
  });
}
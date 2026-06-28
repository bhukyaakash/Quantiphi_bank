const { MERCHANT_CATEGORIES } = require('./parser');

/**
 * Get all available categories
 */
const getCategories = () => {
  return ["Food & Dining", "Travel", "Salary", "Miscellaneous"];
};

/**
 * Validate if category is valid
 */
const isValidCategory = (category) => {
  return getCategories().includes(category);
};

/**
 * Get category color mapping
 */
const getCategoryColors = () => {
  return {
    "Food & Dining": "#FF6B6B",
    "Travel": "#4ECDC4",
    "Salary": "#45B7D1",
    "Miscellaneous": "#96CEB4"
  };
};

/**
 * Get category icon mapping
 */
const getCategoryIcons = () => {
  return {
    "Food & Dining": "🍽️",
    "Travel": "🚗",
    "Salary": "💰",
    "Miscellaneous": "📦"
  };
};

module.exports = {
  getCategories,
  isValidCategory,
  getCategoryColors,
  getCategoryIcons
};

const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {string} id - User ID to encode in the token
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;

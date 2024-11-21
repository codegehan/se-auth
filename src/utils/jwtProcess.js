const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = async (userId, userName, userEmail) => {
  return jwt.sign({ userId, userEmail, userName }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

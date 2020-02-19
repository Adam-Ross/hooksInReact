const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // If no token, status change
  if (!token) {
    res.status(400).json({ msg: "No token..." });
  }

  try {
    const decoded = jwt.verify(token, config.get("jsToken"));

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is invalid..." });
  }
};

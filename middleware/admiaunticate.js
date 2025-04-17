// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not admin" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = adminAuth;

const jwt = require("jsonwebtoken");
const studentmodel = require("../model/usermodel");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("❌ No token found in cookies");
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    const student = await studentmodel.findById(decoded.id);
    if (!student) {
      console.log(" No student found with ID:", decoded.id);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.student = student; // Attach the student to the request
    next();
  } catch (err) {
    console.error(" Token verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized: Token invalid", error: err.message });
  }
};

module.exports = authenticate;

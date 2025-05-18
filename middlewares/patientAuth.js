const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract token only

    try {
  

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.body.patientID = decoded.patientID; // attach to request
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  } else {
    return res.status(401).json({ message: "Token missing or malformed." });
  }
};

module.exports = { authenticate };

// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (token) {
//     const decoded = jwt.verify(token, process.env.key);
//     if (decoded) {
//       const doctorID = decoded.doctorID;
//       req.body.doctorID = doctorID;
//       next();
//     } else {
//       res.send("You cannot edit this token.");
//     }
//   } else {
//     res.send("Inadequate permissions, Please login first.");
//   }
// };

const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // console.log("Received Authorization Header:", authHeader); // Debugging line

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or improperly formatted" });
  }

  const token = authHeader.split(" ")[1]; // Extract the actual token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded); // Debugging line

    if (!decoded.doctorID) {
      return res.status(403).json({ message: "Invalid token: Missing doctorID" });
    }

    req.user = { doctorID: decoded.doctorID };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // Debugging line
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticate };

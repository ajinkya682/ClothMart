const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1. Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Then check Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3. No token found
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "No token. Access denied.",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired. Please login again.",
    });
  }
};

module.exports = authMiddleware;

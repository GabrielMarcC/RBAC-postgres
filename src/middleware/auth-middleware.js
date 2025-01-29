import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

class Auth {
  authenticate(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Token is required" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  authorize(roles = []) {
    return (req, res, next) => {
      if (!roles.length) return next();

      const userRoles = req.user?.roles || [];
      const hasRole = roles.some((role) => userRoles.includes(role));

      if (!hasRole) return res.status(403).json({ message: "Access Denied" });

      next();
    };
  }
}

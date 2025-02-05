import jwt from "jsonwebtoken";
import "dotenv/config";

export class AuthMiddleware {
	static authenticate(req, res, next) {
		const { JWT_SECRET } = process.env;

		const token = req.header("Authorization")?.split(" ")[1];

		if (!token) return res.status(403).json({ message: "Token is required" });

		try {
			const decoded = jwt.verify(token, JWT_SECRET);

			req.user = decoded;
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Token expired" });
			}

			return res.status(401).json({ message: "Invalid token" });
		}
	}

	static authorize(roles = []) {
		return (req, res, next) => {
			if (!req.user) {
				return res.status(401).json({ message: "Authentication is required!" });
			}

			if (!roles.length) return next();

			const userRoles = req.user?.roles || [];
			const hasRole = roles.some((role) => userRoles.includes(role));

			if (!hasRole) return res.status(403).json({ message: "Access Denied" });

			next();
		};
	}
}

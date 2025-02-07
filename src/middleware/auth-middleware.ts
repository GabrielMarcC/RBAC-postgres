import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

export class AuthMiddleware {
	static authenticate(req: Request, res: Response, next: NextFunction) {
		try {
			const { JWT_SECRET } = process.env;

			const token = req.header("Authorization")?.split(" ")[1];

			if (!token) {
				res.status(403).json({ message: "Token is required" });
				return;
			}
			const decoded = jwt.verify(token, JWT_SECRET);

			req.user = decoded;
			next();
		} catch (error) {
			res.status(401).json({ message: error });
		}
	}

	static authorize(roles: string[]) {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!req.user) {
				res.status(401).json({ message: "Authentication is required!" });
				return;
			}

			if (!roles.length) {
				next();
				return;
			}

			const userRoles = req.user?.roles as JwtPayload;

			const hasRole = roles.some((role) => userRoles.includes(role));

			if (!hasRole) {
				res.status(403).json({ message: "Access Denied" });
				return;
			}

			next();
		};
	}
}

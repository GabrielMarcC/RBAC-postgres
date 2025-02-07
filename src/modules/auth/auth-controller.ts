import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { db } from "@/lib/connection/db";
import { roles, user_roles, users } from "@/lib/schemas";

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

export class AuthController {
	static async login(req: Request, res: Response) {
		const { email, password } = req.body;

		try {
			const user = await db.query.users.findFirst({
				where: eq(users.email, email)
			});

			if (!user) {
				res.status(400).json({ message: "Invalid credentials" });
				return;
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				res.status(400).json({ message: "Invalid credentials" });
				return;
			}

			const search = await db
				.select()
				.from(roles)
				.innerJoin(user_roles, eq(roles.id, user_roles.user_id));

			if (!search) {
				res.status(400).json({ message: "User roles not found" });
				return;
			}

			const role = search.map((r) => r.roles.name);

			const token = jwt.sign({ userId: user.id, roles: role }, JWT_SECRET!, {
				expiresIn: JWT_EXPIRATION
			});

			res.json({ token });
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

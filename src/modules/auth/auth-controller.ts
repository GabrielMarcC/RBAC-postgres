import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { db } from "@/lib/connection/db";
import { users } from "@/lib/schemas";

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

			const userWithRoles = (await db.query.users.findFirst({
				where: eq(users.id, user.id),
				with: {
					user_roles: {
						role: true
					}
				}
			})) as typeof users.$inferSelect & {
				user_roles: { role: { name: string } }[];
			};

			if (!userWithRoles) {
				res.status(400).json({ message: "User roles not found" });
				return;
			}

			const roleNames = userWithRoles.user_roles.map((ur) => ur.role.name);

			const token = jwt.sign(
				{ userId: user.id, roles: roleNames },
				JWT_SECRET!,
				{
					expiresIn: JWT_EXPIRATION
				}
			);

			res.json({ token });
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

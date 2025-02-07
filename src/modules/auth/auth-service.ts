import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "@/lib/connection/db";
import { roles, user_roles, users } from "@/lib/schemas/index";

export class AuthService {
	static async register(req: Request, res: Response) {
		const { email, password } = req.body;

		try {
			const existingUser = await db.query.users.findFirst({
				where: eq(users.email, email)
			});

			if (existingUser) {
				res.status(400).json({ message: "User already exists!" });
				return;
			}

			const hashPassword = await bcrypt.hash(password, 10);

			const newUser = await db
				.insert(users)
				.values({ email, password: hashPassword })
				.returning({
					id: users.id
				});
			const userId = newUser[0].id;

			const defaultRole = await db
				.select()
				.from(roles)
				.where(eq(roles.name, "user"));

			await db
				.insert(user_roles)
				.values({ user_id: userId, role_id: defaultRole[0].id });

			res.status(201).json({ message: "User registered sucessfully" });
		} catch (error) {
			res.status(500).json({ message: error });
		}
	}
}

import { drizzle } from "drizzle-orm/neon-http";

import { roles, user_roles, users } from "../schemas";

export const db = drizzle({
	connection: process.env.DATABASE_URL,
	schema: {
		users,
		user_roles,
		roles
	}
});

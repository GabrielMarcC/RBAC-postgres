import { z } from "zod";

import { insertUsersSchema } from "@/lib/schemas";

export const authSchema = insertUsersSchema
	.pick({
		email: true
	})
	.extend({
		password: z.string().min(6, "Password must be at least 6 characters")
	});

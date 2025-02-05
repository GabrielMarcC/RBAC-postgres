import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	primaryKey,
	serial,
	varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const roles = pgTable("roles", {
	id: serial().primaryKey(),
	name: varchar({ length: 50 }).unique().notNull()
});

export const users = pgTable("users", {
	id: serial().primaryKey(),
	email: varchar({ length: 100 }).unique(),
	password: varchar({ length: 255 }).notNull()
});

export const user_roles = pgTable(
	"user_roles",
	{
		user_id: integer("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		role_id: integer("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" })
	},
	(table) => [primaryKey({ columns: [table.user_id, table.role_id] })]
);

export const usersRelations = relations(users, ({ many }) => ({
	userRoles: many(user_roles)
}));

export const userRolesRelations = relations(user_roles, ({ one }) => ({
	user: one(users, {
		fields: [user_roles.user_id],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [user_roles.role_id],
		references: [roles.id]
	})
}));

export const rolesRelations = relations(roles, ({ many }) => ({
	userRoles: many(user_roles)
}));

export const rolesSchema = createSelectSchema(roles);
export const insertRolestSchema = createInsertSchema(roles);

export const usersSchema = createSelectSchema(users);
export const insertUsersSchema = createInsertSchema(users);

export const usersRoles = createSelectSchema(user_roles);
export const insertUsersRolesSchema = createInsertSchema(user_roles);

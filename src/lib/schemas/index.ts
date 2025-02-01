import {
  integer,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
});

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: varchar({ length: 100 }).unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const user_roles = pgTable(
  "user_roles",
  {
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role_id: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.user_id, table.role_id] })]
);

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/migrations",
	schema: "./src/lib/schemas/index.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});

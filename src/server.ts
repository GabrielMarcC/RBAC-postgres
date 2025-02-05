import express from "express";

import "dotenv/config";
import authRouter from "./modules/auth/auth-router";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

const { PORT } = process.env;

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});

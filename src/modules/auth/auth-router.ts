import { Request, Response, Router } from "express";

import { validateMiddleware } from "@/middleware/validate-middleware";

import { AuthController } from "./auth-controller";
import { AuthService } from "./auth-service";
import { authSchema } from "./auth-validate";
import { AuthMiddleware } from "../../middleware/auth-middleware";

const authRouter = Router();

authRouter.post(
	"/register",
	validateMiddleware(authSchema),
	AuthService.register
);

authRouter.post("/login", validateMiddleware(authSchema), AuthController.login);

authRouter.get(
	"/profile",
	AuthMiddleware.authenticate,
	(req: Request, res: Response) => {
		const { user } = req.body;

		res.status(200).json({
			message: "User authenticated sucessfully",
			user
		});
	}
);

authRouter.get(
	"/admin",
	AuthMiddleware.authenticate,
	AuthMiddleware.authorize(["admin"]),
	(_, res: Response) => {
		res.json({
			message: "Acess Denied"
		});
	}
);

export default authRouter;

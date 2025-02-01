import { Request, Response, Router } from "express";

import { AuthController } from "./auth-controller.js";
import { AuthService } from "./auth-service.js";
import { AuthMiddleware } from "../../middleware/auth-middleware.js";

const authRouter = Router();

authRouter.post("/register", AuthService.register);

authRouter.post("/login", AuthController.login);

authRouter.get(
  "/profile",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    const { user } = req.body;

    res.status(200).json({
      message: "User authenticated sucessfully",
      user,
    });
  }
);

authRouter.get(
  "/admin",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["admin"]),
  (_, res: Response) => {
    res.json({
      message: "Acess Denied",
    });
  }
);

export default authRouter;

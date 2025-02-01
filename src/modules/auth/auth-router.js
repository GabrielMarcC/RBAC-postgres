"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_js_1 = require("./auth-controller.js");
var auth_service_js_1 = require("./auth-service.js");
var auth_middleware_js_1 = require("../../middleware/auth-middleware.js");
var authRouter = (0, express_1.Router)();
authRouter.post("/register", auth_service_js_1.AuthService.register);
authRouter.post("/login", auth_controller_js_1.AuthController.login);
authRouter.get("/profile", auth_middleware_js_1.AuthMiddleware.authenticate, function (req, res) {
    var user = req.body.user;
    res.status(200).json({
        message: "User authenticated sucessfully",
        user: user,
    });
});
authRouter.get("/admin", auth_middleware_js_1.AuthMiddleware.authenticate, auth_middleware_js_1.AuthMiddleware.authorize(["admin"]), function (_, res) {
    res.json({
        message: "Acess Denied",
    });
});
exports.default = authRouter;

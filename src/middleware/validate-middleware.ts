/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssueOptionalMessage } from "zod";

export function validateMiddleware(schema: z.ZodObject<any, any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors.map(
					(issue: ZodIssueOptionalMessage) => ({
						message: `${issue.path.join(".")} is ${issue.message}`
					})
				);
				res.status(400).json({ error: "Invalid data", details: errorMessages });
			} else {
				res.status(500).json({ error: "Internal Server Error" });
			}
		}
	};
}

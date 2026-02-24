import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError";
import { Prisma } from "../generated/prisma/client";


export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	let statusCode = 500;
	let message = "Internal server error";

	const isDev = process.env.NODE_ENV !== "production";

	// Custom Application Errors

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err instanceof ZodError) {
		// Zod Validation Errors
		statusCode = 400;
		message = "Validation error";
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// Prisma Known Errors
		switch (err.code) {
			case "P2002":
				statusCode = 409;
				message = "Duplicate value already exists";
				break;

			case "P2003":
				statusCode = 400;
				message = "Invalid reference provided";
				break;

			case "P2025":
				statusCode = 404;
				message = "Record not found";
				break;

			default:
				statusCode = 400;
				message = "Database request error";
		}
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		// Prisma Validation Error
		statusCode = 400;
		message = "Invalid data format provided";
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		// Prisma Initialization Error
		statusCode = 500;
		message = "Database connection failed";
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		// Prisma Unknown Error
		statusCode = 500;
		message = "Unexpected database error";
	} else if (err instanceof Error) {
		// Native JS Errors
		message = err.message || message;
	}

	// Final Response
	res.status(statusCode).json({
		success: false,
		message,
		...(isDev && { error: err }),
	});
};

export default globalErrorHandler;
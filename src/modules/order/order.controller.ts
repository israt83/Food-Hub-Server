import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { UserRole } from "../../generated/prisma/enums";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response ,next : NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.CUSTOMER) {
		throw new AppError(403, "Only customers can place orders");
	}

	const result = await orderService.createOrder(req.user.id, req.body);

	res.status(201).json({
		success: true,
		data: result,
	});
    } catch (error) {
        
    }
}
export const orderController ={
    createOrder,
}
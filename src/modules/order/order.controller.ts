import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";

import { orderService } from "./order.service";
import { UserRole } from "../../../prisma/generated/prisma/enums";

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
        next(error);
    }
}

const  getMyOrders = async (req: Request, res: Response ,next : NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	
	const result = await orderService.getMyOrders(req.user.id);

	res.status(201).json({
		success: true,
        message: "Orders fetched successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

const getSingleOrder = async (req: Request, res: Response ,next : NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	const { orderId } = req.params;

    if (!orderId) {
        throw new AppError(400, "Order ID is required");
    }
	const result = await orderService.getSingleOrder(req.user.id, orderId as string);

	res.status(201).json({
		success: true,
        message: "Order fetched successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}
const  cancelOrder = async (req: Request, res: Response ,next : NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.CUSTOMER) {
		throw new AppError(403, "Only customers can cancel orders");
	}

	const { orderId } = req.params;

    if (!orderId) {
        throw new AppError(400, "Order ID is required");
    }

	const result = await orderService.cancelOrder(req.user.id, orderId as string);

	res.status(201).json({
		success: true,
        message: "Order cancelled successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

// Admin controller 
const  getAllOrdersForAdmin = async (req: Request, res: Response ,next : NextFunction) => {
    try {
    const result = await orderService.getAllOrdersForAdmin();   
	res.status(201).json({
		success: true,
        message: "All orders fetched successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

const  updateOrderStatus = async (req: Request, res: Response ,next : NextFunction) => {
    try {
     if(!req.user){
        throw new AppError(401, "Unauthorized access");
     }   
    const { orderId } = req.params;
    const { status } = req.body;

    if(!orderId || !status){
        throw new AppError(400, "Order ID and status are required");
    }

    const result = await orderService.updateOrderStatus(orderId as string, status);   
	res.status(201).json({
		success: true,
        message: "Order status updated successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

const  cancelOrderByAdmin = async (req: Request, res: Response ,next : NextFunction) => {
    try {
     if(!req.user){
        throw new AppError(401, "Unauthorized access");
     }   
    const { orderId } = req.params;
    

    if(!orderId){
        throw new AppError(400, "Order ID is required");
    }

    const result = await orderService.cancelOrderByAdmin(orderId as string);   
	res.status(201).json({
		success: true,
        message: "Order cancelled successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

export const orderController ={
    createOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder,
    getAllOrdersForAdmin,
    updateOrderStatus,
    cancelOrderByAdmin
}


import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewService } from "./review.service";

const createReview = async (req : Request, res:Response ,next : NextFunction) =>{
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.CUSTOMER) {
		throw new AppError(403, "Only customers can leave reviews");
	}

	const result = await reviewService.createReview(req.user.id, req.body);

	res.status(201).json({
		success: true,
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

const getReviewsByMeal = async (req: Request, res: Response , next : NextFunction) => {
    try {
        const { mealId } = req.params;
	const result = await reviewService.getReviewsByMeal(mealId as string);

	res.status(200).json({
		success: true,
		message: "Reviews fetched successfully",
		data: result,
	});
    } catch (error) {
        next(error)
    }
}

export const reviewController = {
	createReview,
	getReviewsByMeal,
};
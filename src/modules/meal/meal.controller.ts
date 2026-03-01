import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

import { mealService } from "./meal.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { DietaryType, UserRole } from "../../../prisma/generated/prisma/enums";

const createMeal = async (req: Request, res: Response , next : NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can create meals");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(400, "Provider profile not found");
	}

	const result = await mealService.createMeal(req.body, provider.id);

	res.status(201).json({
		success: true,
        message: "Meal created successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

const getSingleMeal = async (req: Request, res: Response , next : NextFunction) => {
    try {
        const { mealId } = req.params;

	if (!mealId) {
		throw new AppError(400, "Meal ID is required");
	}

	const result = await mealService.getSingleMeal(mealId as string);

	if (!result) {
		throw new AppError(404, "Meal not found");
	}

	res.status(200).json({
		success: true,
        message: "Meal fetched successfully",
		data: result,
	});
        
    } catch (error) {
        next(error);
    }
}
const getAllMeals = async (req: Request, res: Response , next : NextFunction) => {
    try {
        const search = typeof req.query.search === "string" ? req.query.search : undefined;

	let isAvailable: boolean | undefined;
	if (typeof req.query.isAvailable === "string") {
		if (req.query.isAvailable === "true") isAvailable = true;
		if (req.query.isAvailable === "false") isAvailable = false;
	}

	const providerId = typeof req.query.providerId === "string" ? req.query.providerId : undefined;

	const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

	const dietaryPreference =
		typeof req.query.dietaryType === "string" &&
		Object.values(DietaryType).includes(req.query.dietaryType as DietaryType)
			? (req.query.dietaryType as DietaryType)
			: undefined;

	const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

	const result = await mealService.getAllMeals({
		search,
		categoryId,
		providerId,
		dietaryPreference,
		isAvailable,
		page,
		limit,
		skip,
		sortBy,
		sortOrder,
	});

	res.status(200).json({
		success: true,
        message: "Meals fetched successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }
}

export const mealController = {
	createMeal,
	getSingleMeal,
	getAllMeals,
};
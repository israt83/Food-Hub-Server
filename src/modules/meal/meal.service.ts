import { AppError } from "../../errors/AppError";
import { Meal } from "../../generated/prisma/client";
import { MealWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { GetMealsParams } from "../../types/meal.type";


const createMeal = async (
	data: Omit<Meal, "id" | "createdAt" | "updatedAt" | "providerId">,
	providerId: string,
) => {
	if (!providerId) {
		throw new AppError(400, "Provider ID is required");
	}

	const result = await prisma.meal.create({
		data: {
			...data,
			providerId,
		},
	});
	return result;
};

const getAllMeals = async ({
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
}: GetMealsParams) => {
	const where: MealWhereInput = {};

	if (search) {
		where.OR = [
			{
				name: {
					contains: search,
					mode: "insensitive",
				},
			},
			{
				description: {
					contains: search,
					mode: "insensitive",
				},
			},
		];
	}

	if (categoryId) {
		where.categoryId = categoryId;
	}

	if (providerId) {
		where.providerId = providerId;
	}

	if (dietaryPreference) {
		where.dietaryType = dietaryPreference;
	}

	if (typeof isAvailable === "boolean") {
		where.isAvailable = isAvailable;
	}

	// Only show meals from ACTIVE providers
	where.provider = {
		user: {
			status: "ACTIVE",
		},
	};

	const meals = await prisma.meal.findMany({
		where,
		take: limit,
		skip,
		orderBy: {
			[sortBy]: sortOrder,
		},
		include: {
			_count: { select: { reviews: true } },
			reviews: true,
		},
	});

	const mealsWithRating = meals.map(meal => {
		const totalReviews = meal.reviews.length;

		const averageRating =
			totalReviews > 0 ? meal.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews : 0;

		const { reviews, ...mealData } = meal;

		return {
			...mealData,
			averageRating: parseFloat(averageRating.toFixed(1)),
		};
	});

	const total = await prisma.meal.count({ where });

	return {
		data: mealsWithRating,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getSingleMeal = async (id: string) => {
	if (!id) {
		throw new AppError(400, "Meal ID is required");
	}

	const meal = await prisma.meal.findFirst({
		where: {
			id,
			provider: {
				user: {
					status: "ACTIVE",
				},
			},
		},
		include: {
			provider: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!meal) {
		throw new AppError(404, "Meal not found or not available");
	}

	// suspended provider's meal won't show
	if (meal.provider.user.status === "SUSPENDED") {
		throw new AppError(403, "This meal is not available");
	}

	return meal;
};


export const mealService = {
	createMeal,
	getSingleMeal,
	getAllMeals,
};
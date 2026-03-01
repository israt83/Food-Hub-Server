// import { DietaryType } from "../generated/prisma/enums";

import { DietaryType } from "../../prisma/generated/prisma/enums";


export type GetMealsParams = {
	search?: string | undefined;
	categoryId?: string | undefined;
	providerId?: string | undefined;
	dietaryPreference?: DietaryType | undefined;
	isAvailable?: boolean | undefined;

	page: number;
	limit: number;
	skip: number;
	sortBy: string;
	sortOrder: "asc" | "desc";
};
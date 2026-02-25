export type CreateReviewPayload = {
	orderId: string;
	mealId: string;
	rating: number;
	comment?: string;
};
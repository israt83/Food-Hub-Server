export type CreateOrderPayload = {
	providerId: string;
	items: {
		mealId: string;
		quantity: number;
	}[];
	deliveryAddress: string;
};
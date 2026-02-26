import { AppError } from "../../errors/AppError";
import { OrderStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "../../types/order.type";

const createOrder = async (userId: string, payload: CreateOrderPayload) => {
	if (!payload.items || payload.items.length === 0) {
		throw new AppError(400, "Order must contain at least one item");
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError(401, "User not found");
	}

	const meals = await prisma.meal.findMany({
		where: {
			id: { in: payload.items.map(i => i.mealId) },
			isAvailable: true,
			provider: {
				isOpen: true,
				user: { status: "ACTIVE" },
			},
		},
		include: {
			provider: true,
		},
	});

	const providerId = meals[0]!.providerId;
	const uniqueProviders = new Set(meals.map(m => m.providerId));

	if (uniqueProviders.size > 1) {
		throw new AppError(400, "Meals must be from a single provider");
	}

	const orderItemsData = payload.items.map(item => {
		const meal = meals.find(m => m.id === item.mealId)!;
		return {
			mealId: meal.id,
			mealName: meal.name,
			mealPrice: meal.price,
			quantity: item.quantity,
		};
	});

	const totalPrice = orderItemsData.reduce((sum, item) => sum + item.mealPrice * item.quantity, 0);

	const order = await prisma.order.create({
		data: {
			customerId: user.id,
			providerId,
			deliveryAddress: payload.deliveryAddress,
			status: OrderStatus.PLACED,
			totalPrice,
			items: {
				create: orderItemsData,
			},
		},
		include: {
			items: true,
		},
	});

	// Send email safely
	// if (user.email) {
	// 	await transporter.sendMail(
	// 		orderConfirmationEmail({
	// 			email: user.email,
	// 			orderId: order.id,
	// 			totalPrice: order.totalPrice,
	// 			address: order.deliveryAddress,
	// 		}),
	// 	);
	// }

	return order;
};

const getMyOrders = async (userId: string) => {
	if (!userId) {
		throw new AppError(401, "Unauthorized access");
	}

	return prisma.order.findMany({
		where: {
			customerId: userId,
		},
		include: {
			items: {
				include: {
					meal: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const getSingleOrder = async (userId: string, orderId: string) => {
	if (!orderId) {
		throw new AppError(400, "Order ID is required");
	}

	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			customerId: userId,
		},
		include: {
			items: {
				include: {
					meal: true,
				},
			},
			provider: true,
		},
	});

	if (!order) {
		throw new AppError(404, "Order not found");
	}

	return order;
};

const cancelOrder = async (customerId: string, orderId: string) => {
	if (!orderId) {
		throw new AppError(400, "Order ID is required");
	}

	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			customerId,
		},
	});

	if (!order) {
		throw new AppError(404, "Order not found");
	}

	if (order.status !== OrderStatus.PLACED) {
		throw new AppError(400, "Order cannot be cancelled at this stage");
	}

	const cancelledOrder = await prisma.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: OrderStatus.CANCELLED,
		},
	});

	return cancelledOrder;
};

 export const orderService ={
    createOrder,
    getMyOrders,
    getSingleOrder,
    cancelOrder
 }
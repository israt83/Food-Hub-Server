import { AppError } from "../../errors/AppError";
import { Meal, OrderStatus, ProviderProfile } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// auto create provider when user created with role provider
const createProvider = async (id: string) => {
  if (!id) {
    throw new AppError(401, "Unauthorized access");
  }

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(404, "Provider not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      userId: user.id,
      isOpen: true,
      restaurantName: "",
      description: "",
      address: "",
      phone: "",
    },
  });
  return result;
};

const getAllProviders = async () => {
  const result = await prisma.providerProfile.findMany({
    where: {
      isOpen: true,
      user: {
        status: "ACTIVE",
      },
    },
  });
  return result;
};

const getMyProfile = async (userId: string) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }

  const result = await prisma.providerProfile.findFirst({
    where: {
      userId,
      user: {
        status: "ACTIVE",
      },
    },
  });
  if (!result) {
    throw new AppError(404, "Provider not found");
  }
  return result;
};

const updateMyProfile = async (
  userId: string,
  data: Partial<ProviderProfile>,
) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }

  const result = await prisma.providerProfile.findFirst({
    where: {
      userId,
    },
  });
  if (!result) {
    throw new AppError(404, "Provider not found");
  }
  const updated = await prisma.providerProfile.update({
    where: {
      id: result.id,
    },
    data,
  });
  return updated;
};

const getProviderProfileWithMeals = async (providerId: string) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }

  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isOpen: true,
      user: {
        status: "ACTIVE",
      },
    },
    include: {
      meals: {
        where: {
          isAvailable: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!provider) {
    throw new AppError(404, "Provider not found or not available");
  }

  return provider;
};

// ------------------- ORDERS ------------------------

const getIncomingOrders = async (providerId: string) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }

  return prisma.order.findMany({
    where: {
      providerId,
      status: {
        in: [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY],
      },
    },
    include: {
      items: {
        include: { meal: true },
      },
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getProviderAllOrders = async (providerId: string) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }

  return prisma.order.findMany({
    where: {
      providerId,
      status: {
        in: [OrderStatus.CANCELLED, OrderStatus.DELIVERED],
      },
    },
    include: {
      items: {
        include: { meal: true },
      },
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ------------------- MENU ------------------------

const updateMeal = async (
  providerId: string,
  mealId: string,
  data: Partial<Meal>,
) => {
  if (!providerId || !mealId) {
    throw new AppError(400, "Provider ID and Meal ID are required");
  }

  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId,
    },
  });

  if (!meal) {
    throw new AppError(404, "Meal not found or unauthorized");
  }

  return prisma.meal.update({
    where: { id: mealId },
    data,
  });
};

const deleteMeal = async (providerId: string, mealId: string) => {
  if (!providerId || !mealId) {
    throw new AppError(400, "Provider ID and Meal ID are required");
  }

  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId,
    },
  });

  if (!meal) {
    throw new AppError(404, "Meal not found or unauthorized");
  }

  return prisma.meal.delete({
    where: { id: mealId },
  });
};

// ------------------- UPDATE ORDER STATUS ------------------------

const updateOrderStatus = async (
  providerId: string,
  orderId: string,
  newStatus: OrderStatus,
) => {
  if (!providerId || !orderId) {
    throw new AppError(400, "Provider ID and Order ID are required");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerId,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found or unauthorized");
  }

  if (order.status === newStatus) {
    throw new AppError(400, "Order status already updated");
  }

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PLACED: [OrderStatus.PREPARING],
    PREPARING: [OrderStatus.READY],
    READY: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!validTransitions[order.status].includes(newStatus)) {
    throw new AppError(400, "Invalid order status transition");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
};


export const ProviderService = {
    createProvider,
    getAllProviders,
    getMyProfile,
    updateMyProfile,
    getProviderProfileWithMeals,
    getIncomingOrders,
    getProviderAllOrders,
    updateMeal,
    deleteMeal,
    updateOrderStatus
    
}
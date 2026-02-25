import { Router } from "express";
import { authMiddleware, UserRole } from "../../middleware/auth.middleware";
import { ProviderController } from "./provider.controller";


const router = Router();

router.post("/providers", ProviderController.createProvider);

router.get("/providers", ProviderController.getAllProviders);

router.get("/provider/me", authMiddleware(UserRole.provider), ProviderController.getMyProfile);

router.get("/providers/:providerId", ProviderController.getProviderProfileWithMeals);

router.get(
	"/provider/orders",
	authMiddleware(UserRole.provider),
	ProviderController.getIncomingOrders,
);

router.get(
	"/provider/all-orders",
	authMiddleware(UserRole.provider),
	ProviderController.getProviderAllOrders,
);

router.patch(
	"/provider/meals/:mealId",
	authMiddleware(UserRole.provider),
	ProviderController.updateMeal,
);

router.patch("/provider/me", authMiddleware(UserRole.provider), ProviderController.updateMyProfile);

router.patch(
	"/provider/orders/:orderId/status",
	authMiddleware(UserRole.provider),
	ProviderController.updateOrderStatus,
);

router.delete(
	"/provider/meals/:mealId",
	authMiddleware(UserRole.provider),
	ProviderController.deleteMeal,
);
export const providerRoute = router;
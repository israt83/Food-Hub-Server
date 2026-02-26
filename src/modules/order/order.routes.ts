import { Router } from "express";
import { authMiddleware, UserRole } from "../../middleware/auth.middleware";
import { orderController } from "./order.controller";

const router = Router();

// Customer routes
router.post("/orders", authMiddleware(UserRole.customer), orderController.createOrder);
router.get("/orders", authMiddleware(UserRole.customer), orderController.getMyOrders);
router.get("/orders/:orderId", authMiddleware(UserRole.customer), orderController.getSingleOrder);
router.patch(
	"/orders/:orderId/cancel",
	authMiddleware(UserRole.customer),
	orderController.cancelOrder,
);

export const orderRoute = router;
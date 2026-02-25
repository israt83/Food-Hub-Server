import { Router } from "express";
import { authMiddleware, UserRole } from "../../middleware/auth.middleware";
import { orderController } from "./order.controller";

const router = Router();

router.post("/orders", authMiddleware(UserRole.customer), orderController.createOrder);

export const orderRoute = router;
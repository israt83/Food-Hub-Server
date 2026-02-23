import { Router } from "express";

import { userController } from "./user.controller";
import { authMiddleware, UserRole } from "../../middleware/auth.middleware";

const router = Router();

/* ---------- CUSTOMER / PROVIDER ---------- */
router.get("/users/me", authMiddleware(), userController.getMyProfile);
router.patch("/users/me", authMiddleware(), userController.UpdateMyProfile);
router.patch("/users/:userId/role", userController.updateUserRoleToProvider);

/* --------------- ADMIN ------------------- */
router.get("/users/admin/users", authMiddleware(UserRole.admin), userController.getAllUsers);

router.patch(
	"/users/admin/users/:userId/status",
	authMiddleware(UserRole.admin),
	userController.UpdateUserStatus,
);

export const userRoute = router;
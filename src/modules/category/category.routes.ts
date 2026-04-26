import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware, UserRole } from "../../middleware/auth.middleware";

const router = Router();
router.post(
  "/categories",
  authMiddleware(UserRole.admin),
  categoryController.createCategory,
);
router.get("/categories", categoryController.getAllCategories);
router.patch(
  "/categories/:categoryId",
  authMiddleware(UserRole.admin),
  categoryController.updateCategories,
);
router.delete(
  "/categories/:categoryId",
  authMiddleware(UserRole.admin),
  categoryController.deleteCategories,
);

export const categoryRoutes = router;



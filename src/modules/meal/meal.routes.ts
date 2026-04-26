import { Router } from "express";

import { mealController } from "./meal.controller";
import { authMiddleware, UserRole } from "../../middleware/auth.middleware";

const router = Router();

router.post("/meals", authMiddleware(UserRole.admin, UserRole.provider), mealController.createMeal);
router.get("/meals", mealController.getAllMeals);
router.get("/meals/:mealId", mealController.getSingleMeal);

export const mealRoute = router;

import { Router } from "express";
import { categoryController } from "./category.controller";


const router = Router();
router.post("/categories", categoryController.createCategory)
router.get("/categories", categoryController.getAllCategories)
router.patch("/categories/:categoryId", categoryController.updateCategories)
router.delete("/categories/:categoryId", categoryController.deleteCategories)


export const categoryRoutes = router
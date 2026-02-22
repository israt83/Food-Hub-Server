import { Router } from "express";
import { categoryController } from "./category.controller";


const router = Router();
router.post("/categories", categoryController.createCategory)


export const categoryRoutes = router
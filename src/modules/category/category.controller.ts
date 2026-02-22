import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    console.log("Category API hit");
    const result = await categoryService.createCategory(req.body);
    console.log("✅ Category Created:", result);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const categoryController = {
  createCategory,
};

import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    
    const result = await categoryService.createCategory(req.body);

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

const getAllCategories  = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategories()
        return res.status(200).json({
            success : true,
            message : "Categories fetched successfully",
            data : result
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            error
        })
    }
}

const updateCategories  = async (req: Request, res: Response) => {
    try {
        const {categoryId} = req.params
        const result = await categoryService.updateCategories(categoryId as string, req.body)
        return res.status(200).json({
            success : true,
            message : "Category updated successfully",
            data : result
        })
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            error
        })
    }
}

const deleteCategories  = async (req: Request, res: Response) => {
    try {
        const {categoryId} = req.params
        const result = await categoryService.deleteCategories(categoryId as string)
        return res.status(200).json({
            success : true,
            message : "Category deleted successfully",
            data : result
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            error
        })
    }

}

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategories,
  deleteCategories
};

import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import { AppError } from "../../errors/AppError";
import { UserRole } from "../../../prisma/generated/prisma/enums";


const createCategory = async (req: Request, res: Response , next:NextFunction) => {
  try {
    
    if(!req.user){
        throw new AppError(401,"Unauthorized access")
    }

    if(req.user.role !== UserRole.ADMIN){
        throw new AppError(403,"Only admin can create category")
    }

    const result = await categoryService.createCategory(req.body);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories  = async (req: Request, res: Response , next:NextFunction) => {
    try {
        const result = await categoryService.getAllCategories()
        return res.status(200).json({
            success : true,
            message : "Categories fetched successfully",
            data : result
        })
    } catch (error) {
       next(error)
    }
}

const updateCategories  = async (req: Request, res: Response ,next:NextFunction) => {
    try {
        const {categoryId} = req.params
        const result = await categoryService.updateCategories(categoryId as string, req.body)
        return res.status(200).json({
            success : true,
            message : "Category updated successfully",
            data : result
        })
        
    } catch (error) {
        next(error)
    }
}

const deleteCategories  = async (req: Request, res: Response , next:NextFunction) => {
    try {
        const {categoryId} = req.params
        const result = await categoryService.deleteCategories(categoryId as string)
        return res.status(200).json({
            success : true,
            message : "Category deleted successfully",
            data : result
        })
    } catch (error) {
        next(error)
           
    }

}

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategories,
  deleteCategories
};

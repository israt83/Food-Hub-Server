import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { userService } from "./user.service";
import { UserRole } from "../../middleware/auth.middleware";

const getMyProfile = async (req: Request, res: Response , next : NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = await userService.getMyProfile(req.user.id);
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const UpdateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = await userService.updateMyProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: " Profile updated successfully",
      data: result,
    });
  } catch (error) {
   next(error);
  }
};

/*------- Admin Controller -------*/
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const UpdateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
      throw new AppError(400, "Invalid status");
    }
    const result = await userService.updateUserStatus(userId as string, status);
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRoleToProvider =async (req: Request, res: Response , next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if(role === UserRole.provider){
        const result = await userService.updateUserRoleToProvider(userId as string, role);
        return res.status(200).json({
            success: true,
            message: "Provider created successfully",
              data: result,
    })
    }
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getMyProfile,
  UpdateMyProfile,
  getAllUsers,
  UpdateUserStatus,
  updateUserRoleToProvider
};

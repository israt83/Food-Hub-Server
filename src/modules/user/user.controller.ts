import { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { userService } from "./user.service";
import { UserRole } from "../../middleware/auth.middleware";

const getMyProfile = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = userService.getMyProfile(req.user.id);
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
const UpdateMyProfile = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }
    const result = userService.updateMyProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

/*------- Admin Controller -------*/
const getAllUsers = (req: Request, res: Response) => {
  try {
    const result = userService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
const UpdateUserStatus = (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
      throw new AppError(400, "Invalid status");
    }
    const result = userService.updateUserStatus(userId as string, status);
    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const updateUserRoleToProvider =async (req: Request, res: Response) => {
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
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const userController = {
  getMyProfile,
  UpdateMyProfile,
  getAllUsers,
  UpdateUserStatus,
  updateUserRoleToProvider
};

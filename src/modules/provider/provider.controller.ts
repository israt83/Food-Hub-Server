import { NextFunction, Request, Response } from "express";
import { ProviderService } from "./provider.service";
import { AppError } from "../../errors/AppError";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createProvider = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        const result = await ProviderService.createProvider(req.body)
        res.status(201).json({
            success: true,
            message: "Provider created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }

}

const getAllProviders = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        const result = await ProviderService.getAllProviders()
        res.status(201).json({
            success: true,
            message: "All providers retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }

}

const getMyProfile = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        if(!req.user){
            throw new AppError(401, "Unauthorized access")
        }
        const result = await ProviderService.getMyProfile(req.user.id)
        res.status(201).json({
            success: true,
            message: "Provider profile retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }

}

const updateMyProfile = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        if(!req.user){
            throw new AppError(401, "Unauthorized access")
        }
        if(req.user.role !== UserRole.PROVIDER){
            throw new AppError(403, "Only provider can update provider profile")
        }
        const result = await ProviderService.updateMyProfile(req.user.id, req.body)
        res.status(201).json({
            success: true,
            message: "Provider profile updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }

}

const getProviderProfileWithMeals = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        const {providerId} = req.params
        if(!providerId){
            throw new AppError(400, "Provider ID is required")
        }
        const result = await ProviderService.getProviderProfileWithMeals(providerId as string)
        res.status(201).json({
            success: true,
            message: "Provider profile with meals retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }

}

const getIncomingOrders = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can view orders");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await ProviderService.getIncomingOrders(provider.id);

	res.status(200).json({
		success: true,
		message: "Incoming orders retrieved successfully",
		data: result,
	});

    } catch (error) {
        next(error);
    }

}


const getProviderAllOrders = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can view orders");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await ProviderService.getProviderAllOrders(provider.id);

	res.status(200).json({
		success: true,
        message: "All orders retrieved successfully",
		data: result,
	});

    } catch (error) {
        next(error);
    }

}


const updateOrderStatus = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can update order status");
	}

	const { orderId } = req.params;
	const { status } = req.body;

	if (!orderId || !status) {
		throw new AppError(400, "Order ID and status are required");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await ProviderService.updateOrderStatus(provider.id, orderId as string, status);

	res.status(200).json({
		success: true,
        message: "Order status updated successfully",
		data: result,
	});

    } catch (error) {
        next(error);
    }

}

const updateMeal = async (req : Request, res: Response ,next: NextFunction) => {
    try {
        if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can update meals");
	}

	const { mealId } = req.params;

	if (!mealId) {
		throw new AppError(400, "Meal ID is required");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await ProviderService.updateMeal(provider.id, mealId as string, req.body);

	res.status(200).json({
		success: true,
		message: "Meal updated successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }

}

const deleteMeal = async (req : Request, res: Response ,next: NextFunction) => {
    try {
       if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can delete meals");
	}

	const { mealId } = req.params;

	if (!mealId) {
		throw new AppError(400, "Meal ID is required");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await ProviderService.deleteMeal(provider.id, mealId as string);

	res.status(200).json({
		success: true,
        message: "Meal deleted successfully",
		data: result,
	});
    } catch (error) {
        next(error);
    }

}

export const ProviderController ={
    createProvider,
    getIncomingOrders,
    getProviderAllOrders,
    updateOrderStatus,
    updateMeal,
    deleteMeal,
    getAllProviders,
    getMyProfile,
    updateMyProfile,
    getProviderProfileWithMeals
}
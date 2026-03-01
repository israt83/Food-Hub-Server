


/*----Customer / Provider----*/

import { AppError } from "../../errors/AppError"
import {  UserRole, UserStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select:{
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    })
    if(!user){
        throw new AppError(404,"User not found")
    }

    return user;
}

const updateMyProfile = async (userId: string, data: any) =>{

    const allowedFields = ["name","image","phone"];

    const updateData  :any= {};

    for (const key of allowedFields){
        if(data[key] !== undefined){
            updateData[key] = data[key];
        }
    }
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: updateData
    })


} 


/*---------- Admin -----------*/ 
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select :{
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        },
        where :{
            role :{
                in : ["CUSTOMER","PROVIDER"]
            }
        },
        orderBy :{
            createdAt : "desc"
        }

    })
}

const updateUserStatus = async (userId: string, status: UserStatus) => {
    const user = await prisma.user.findUnique({
        where:{id : userId}
    })
    if(!user){
        throw new AppError(404,"User not found")
    }
    
    if(user.role === "ADMIN"){
        throw new AppError(403,"Admin status cannot be changed")
    }
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        }
    })
    
}

// const updateUserRoleToProvider = async (userId : string ,role : UserRole) =>{
//     const user = await prisma.user.findUnique({
//         where:{id : userId}
//     })
//     if(!user){
//         throw new AppError(404,"User not found")
//     }

//     if(role === UserRole.PROVIDER){
//         return await prisma.user.update({
//             where: {
//                 id: userId
//             },
//             data: {
//                 role : UserRole.PROVIDER
//                 }
//         })

//     }
// }
const updateUserRoleToProvider = async (userId: string, role: UserRole) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return await prisma.$transaction(async (tx) => {

    // 1️⃣ Update user role
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { role: UserRole.PROVIDER }
    });

    // 2️⃣ Check if provider profile exists
    const existingProvider = await tx.providerProfile.findFirst({
      where: { userId }
    });

    // 3️⃣ If not exists → create
    if (!existingProvider) {
      await tx.providerProfile.create({
        data: {
          userId,
          isOpen: true,
          restaurantName: "",
          description: "",
          address: "",
          phone: "",
        }
      });
    }

    return updatedUser;
  });
};


export const userService = {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    updateUserStatus,
    updateUserRoleToProvider
}

import { Category } from "../../generated/prisma/client";
import slug from "../../helpers/slug";
import { prisma } from "../../lib/prisma";

const createCategory = async (data : Omit<Category , 'id' | "createdAt" | "updatedAt" | "meals" | "slug">) =>{

    if(!data.name){
        throw new Error("Category name is required")
    }

    const slugValue = slug(data.name)

    const existingCategory = await prisma.category.findFirst({
        where : {
            OR :[
                {name : data.name},
                {slug : slugValue}
            ]
        }
    })

    if(existingCategory){
        throw new Error("Category already exists")
    }

    const result = await prisma.category.create({
        data : {
            ...data,
            slug : slugValue,
        },
    })
    return result

}


const getAllCategories = async () => {
    const result =  await prisma.category.findMany({
        orderBy :{
           createdAt : "desc"
        }
    })

    return result
}

const updateCategories = async (categoryId : string , data : Partial<Category>) =>{

    if(!categoryId){
        throw new Error("Category id is required")
    }

    const updateData : Partial<Category> = {
        ...data,
    }

    // slug update
    if(data.name){
        updateData.slug = slug(data.name)
    }

    return await prisma.category.update({
        where:{
            id : categoryId
        },
        data : updateData
    })

}

const deleteCategories = async (categoryId : string) =>{
    return await prisma.category.delete({
        where : {
            id : categoryId
        }
    })
}

export const categoryService = {
    createCategory,
    getAllCategories,
    updateCategories,
    deleteCategories
}
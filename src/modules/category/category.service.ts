import { Category } from "../../generated/prisma/client";
import slug from "../../helpers/slug";
import { prisma } from "../../lib/prisma";

const createCategory = async (data : Omit<Category , 'id' | "createdAt" | "updatedAt" | "meals" | "slugs">) =>{

    if(!data.name){
        throw new Error("Category name is required")
    }

    const slugs = slug(data.name)

    const existingCategory = await prisma.category.findFirst({
        where : {
            OR :[
                {name : data.name},
                {slugs}
            ]
        }
    })

    if(existingCategory){
        throw new Error("Category already exists")
    }

    const result = await prisma.category.create({
        data : {
            ...data,
            slugs ,
        },
    })
    return result

}

export const categoryService = {
    createCategory
}
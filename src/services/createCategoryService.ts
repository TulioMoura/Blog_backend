import { getRepository } from "typeorm";

import Category from "../models/Category";
import User from "../models/User"
import BlogError from "../Errors"
interface Request{
    name : string;
    creator: User;
}

export default class createCategoryService{
    public async execute({name, creator}:Request): Promise<Category>{
        const categories = getRepository(Category)

        const categoryExists = await categories.findOne({
            where: {
                name
            }
        })

        if(categoryExists){
            throw new BlogError('Name for category in use',409)
        }

        const newCategory = categories.create({
            name,
            creator,
        })

        await categories.save(newCategory)

        return newCategory;

    }
}
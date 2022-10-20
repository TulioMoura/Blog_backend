import { getRepository } from "typeorm";
import BlogError from "../Errors";
import Category from "../models/Category";

interface Request {
    id: string,
    name: string
}

export default class editCategoryService{
    public async execute({id , name} : Request ): Promise<Category> {

            const categoriesRepo = getRepository(Category);
            const category= await categoriesRepo.findOne({
                where:{id}
            })
            if(!category){
                throw new BlogError("Category not found",404)
            }
            category.name = name;

            await categoriesRepo.save(category)

            return category
        
    }
}
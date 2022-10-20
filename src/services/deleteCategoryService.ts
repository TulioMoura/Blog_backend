import { getRepository } from "typeorm";
import Category from "../models/Category";



export default class deleteCategoryService{
    public async execute(id: string  ){

            const categoriesRepo = getRepository(Category);
             await categoriesRepo.delete(id)
             
            return 
        
    }
}
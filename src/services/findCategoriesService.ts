import { getRepository } from "typeorm";
import { validate } from "uuid";
import BlogError from "../Errors";
import Category from "../models/Category";

export default class findCategoriesService{
    public async execute(id:string[]):Promise<Category[]>{
        console.log(id)
        id.forEach(id => {
            const isUuid = validate(id)
            if(!isUuid){
                throw new BlogError("Is not an uuid Array",400);              
            }
        });
        const categoriesRepo = getRepository(Category)
        const allcategories = await categoriesRepo.find();
        let categories:Category[]=[];
        id.forEach(id => {

            allcategories.forEach(category => {
                if(category.id ===id){
                    categories.push(category)
                    return;
                }
                
            });
            
        });


        return categories;

    }
}
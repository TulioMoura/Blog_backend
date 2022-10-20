import { getRepository } from "typeorm";
import BlogError from "../Errors";
import User from "../models/User";

interface User_Response{
    name:string,
    id:string,
    email:string,
    type:string
}

export default class findUsersService{
    public async execute():Promise<User_Response[]>{
        const usersRepo = getRepository(User);
        const users = await usersRepo.find();
        let  sanitizedUsers : User_Response[] = users;
        if(!users){
            throw new BlogError("Cannot find Users",404)
        }
        users.forEach(user=>{
           sanitizedUsers.push({
               name:user.name,
               id:user.id,
               email:user.email,
               type:user.type

           })

            });
        return users;
    }
}
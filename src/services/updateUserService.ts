import { getRepository } from "typeorm";
import BlogError from "../Errors";

import User from "../models/User";

interface Request{
    id:string,
    name: string 
    email : string ,
}

interface User_Response{
    name:string,
    id:string,
    email:string,
    type:string,

}

export default class updateUserService{
    public async execute({id, name, email}:Request):Promise<User_Response>{
        if(!name||!email){
            throw new BlogError("Invalid Params",400)
        }
        const usersRepo = getRepository(User);
        const user = await usersRepo.findOne({
            where:{id}
        })

        if(!user){
            throw new BlogError("User not Found",404)
        }
        
            user.name = name;
            user.email = email;

        

        await usersRepo.save(user)
        const User_Response:User_Response={
            name:user.name,
            id:user.id,
            email:user.email,
            type:user.type
        }
        return User_Response;
    }
}
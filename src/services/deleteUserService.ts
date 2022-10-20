import {getRepository} from "typeorm";
import { validate } from "uuid";
import BlogError from "../Errors";
import User from "../models/User";

class deleteUserService{
    public async execute(id: string){
        const users = getRepository(User)
            const isUuid = validate(id);

            if(isUuid){
                 const user = await users.findOne({where:{id}});

                 if(user){
                      await users.remove(user)
                      return
                 }
          
           
            }
            else {
                throw new BlogError("invalid id",400)           
            }
           
           
        
        
    }
}
export default deleteUserService;

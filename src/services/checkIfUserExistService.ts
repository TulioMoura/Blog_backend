import {getRepository} from "typeorm";
import User from "../models/User";
import BlogError from "../Errors";
class checkIfUserExistService{
    public async execute(id : string): Promise <User>{
        const users = getRepository(User)

        const existUser = await users.findOne({
            where: {
                id
            }
        });
        if(!existUser){
            throw new BlogError('User Not Exist',400)
        }
        return existUser;
    }
}
export default checkIfUserExistService;

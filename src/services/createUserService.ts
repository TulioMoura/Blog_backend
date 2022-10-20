import { getRepository } from "typeorm";
import {hash} from 'bcryptjs'

import User from "../models/User";
import BlogError from "../Errors";

interface Request {
    name:string,
    email:string,
    passwd:string,
    type:string
}

export default class createUserService {
    public async execute({name, email, type, passwd}: Request):Promise<User>{
        const user_types = ['super-admin','supervisor','editor']
        if(!passwd || passwd.length < 8 ){
            throw new BlogError('password is too short',400)
        }

        const usersRepository = getRepository(User)

        const verifyUserAlreadyExists = await usersRepository.findOne({
            where:{email},
        });

        if(verifyUserAlreadyExists){
            throw new BlogError('Email in use',409)
        }
        if(!(user_types.includes(type))){
            throw new BlogError('Invalid user type',400)
        }
        if(!name){
            throw new BlogError('No name provided',400)
        }

        if(!email){
            throw new BlogError('No Email provided',400)
        }

        

        console.log(passwd)
        const passwdHashed = await hash(passwd, 10)

        const user = usersRepository.create({
            name,
            email,
            passwd:passwdHashed,
            type
        });

        await usersRepository.save(user)

        return user;        
    }
}
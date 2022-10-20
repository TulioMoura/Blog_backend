import { getRepository } from "typeorm";
import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import auth from "../config/auth";
import User from "../models/User";
import BlogError from "../Errors"

interface loginObject {
    email: string,
    passwd: string
}

interface returnedObject {
    user: User_Response,
    token: string
}

interface User_Response {
    name: string,
    id: string,
    email: string,
    type: string
}

export default class authUserService {
    public async execute({ email, passwd }: loginObject): Promise<returnedObject> {

        if (!email) {
            throw new BlogError('Invalid identifiers', 400)
        }

        const usersRepo = await getRepository(User);
        const user = await usersRepo.findOne({
            where: {
                email,
            }
        })

        if (!user) {
            throw new BlogError('Invalid identifiers', 400)
        }

        const passwdCheck = await compare(passwd, user.passwd)

        if (!passwdCheck) {
            throw new BlogError('Invalid identifiers', 400)
        }

        const sanitizedUser: User_Response = {
            name: user.name,
            id: user.id,
            email: user.email,
            type: user.type
        }

        const token = await sign({ id: user.id }, auth.jwt.Secret,


            { expiresIn: auth.jwt.expiresIn })



        return { user: sanitizedUser, token };

    }
}
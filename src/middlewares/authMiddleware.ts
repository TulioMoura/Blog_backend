
import { Request, Response, NextFunction } from "express";
import { verify} from 'jsonwebtoken'

import auth from "../config/auth";

interface JwtPayload{
    id:string,
}

async function authMiddleware(req: Request, res:Response, next:NextFunction){
    const {authorization} = req.headers;
    if(!authorization
){
        res.status(400).json({error:"No authorization Provided"})
    }
    else{

const [bearer ,token] = authorization.split(' ');
    let decodedToken; 
    try{
        decodedToken = await verify(token,auth.jwt.Secret) as JwtPayload;
    }catch(error){
        res.status(403).json({error:"Invalid JWT token"})
    }
    
    const id = decodedToken
    req.body.user_id = id;
    next();

}
}
export default authMiddleware;
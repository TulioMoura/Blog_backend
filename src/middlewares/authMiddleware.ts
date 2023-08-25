
import { Request, Response, NextFunction } from "express";
import { verify} from 'jsonwebtoken'

import auth from "../config/auth";

interface JwtPayload{
    id:string,
    iat:number,
    exp:number
}

async function authMiddleware(req: Request, res:Response, next:NextFunction){
    const {authorization} = req.headers;
    if(!authorization
){
        res.status(400).json({error:"No authorization Provided"})
    }
    else{

const [bearer ,token] = authorization.split(' ');
    let decodedToken = {
        id: '',
        iat: 0,
        exp: 0
      }
    try{
        decodedToken = await verify(token,auth.jwt.Secret) as JwtPayload;
    }catch(error){
        res.status(403).json({error:"Invalid JWT token"})
    }
    
    const {id} = decodedToken
    req.body.user_id = id;
    next();

}
}
export default authMiddleware;
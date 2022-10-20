import { getRepository } from "typeorm";
import Category from "../models/Category";
import Post from "../models/Post";
import User from "../models/User";
import fs from "fs"
import BlogError from "../Errors";

interface Request{
    title:string,
    categories:Category[],
    author:User,
    preview:string,
    body:string,
}

export default class createPostService{
    public async execute({title, categories, author, preview, body}:Request){
        const postsRepo = getRepository(Post)
        const post=await postsRepo.create({
            title,
            categories,
            author,
            preview,
            body
        })
        
        return post;


    }
}
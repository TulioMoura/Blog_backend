import { getRepository } from "typeorm";
import { validate } from "uuid";
import fs from "fs"

import Post from "../models/Post";
import { application } from "express";
import Category from "../models/Category";
import BlogError from "../Errors";

interface sanitizedAuthor{
    name?:string,
    id?:string,

}

interface sanitizedPost{
    id:string,
    title:string,
    categories:Category[],
    author:sanitizedAuthor,
    created_at:Date,
    updated_at:Date,
    preview:string,
    body:string
}

export default class findPostService{
    public async execute(id : string):Promise<{post:sanitizedPost}>{
        const isUuid = validate(id);
        if(!isUuid){
            throw new BlogError("Invalid post Id", 400)
        }
        const postsRepo = getRepository(Post)
        const post = await postsRepo.createQueryBuilder("post").where("post.id = :id", {id:id})
        .leftJoinAndSelect("post.author", "author").getOne()
        
        const author =  {
            name:post?.author.name,
            id:post?.author.id,
        }
        if(!post){
            throw new BlogError("Post not Found",400)
        }
        const sanitizedPost:sanitizedPost = {
            id:post?.id,
            title: post?.title,
            categories:post?.categories,
            author:author,
            created_at:post?.created_at,
            updated_at:post?.updated_at,
            preview:post?.preview,
            body:post?.body
        }

        return {post:sanitizedPost}
    }
}
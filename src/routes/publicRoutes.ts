import { Router } from "express";
import { getRepository } from "typeorm";
import Post from "../models/Post";
import findPostService from "../services/findPostServices";
import Category from "../models/Category";
import BlogError from "../Errors";

const publicRoutes = Router();

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
}

publicRoutes.get('/', async(req, res)=>{
    try {
        const {id} = req.query
        if(!id){
            const postsRepo = getRepository(Post)
            const posts = await postsRepo.createQueryBuilder("post").leftJoinAndSelect("post.author", "author").getMany()
            let sanitizedPosts:sanitizedPost[];

            posts.forEach(post =>{

                const author = {
                    name:post.author.name,
                    id:post.author.id
                }
                sanitizedPosts.push({
                        id:post?.id,
                        title: post?.title,
                        categories:post?.categories,
                        author:author,
                        created_at:post?.created_at,
                        updated_at:post?.updated_at,
                        preview:post?.preview
            
                    
                })
            })
           return res.json({posts}) 
        }
        if(typeof(id)!="string"){
            throw new Error("invalid post Id provided")
        }

        const findPost= new findPostService;
        const post = await  findPost.execute(id)
        console.log(post)
        return res.json(post)
    

    }  catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
})


export default publicRoutes;
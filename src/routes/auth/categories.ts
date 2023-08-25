import Router, { request } from "express";
import { getRepository } from "typeorm";
import BlogError from "../../Errors";
import Category from "../../models/Category";
import User from "../../models/User";

import checkIfUserExistService from "../../services/checkIfUserExistService";
import createCategoryService from "../../services/createCategoryService";
import deleteCategoryService from "../../services/deleteCategoryService";
import editCategoryService from "../../services/editCategoryService";

const categoriesRoutes = Router();

categoriesRoutes.get('/', async (req, res)=>{
    const categoriesRepo = getRepository(Category)
    const categories = await categoriesRepo.find();
    //preciso retornar também o nome/id do criador da categoria

    return res.json(categories);
})

categoriesRoutes.post('/', async (req, res)=>{
    //esta rota deve receber um nome e criar a categoria,
    //o criador e a date são gerados
    const {name, user_id} = req.body;
    
    try {
        const chekUser = new checkIfUserExistService;

        const creator = await chekUser.execute(user_id)
        
        //preciso checar se o usuário tem permissão de criação de categorias8

        const createCategory = new createCategoryService

        const category = await createCategory.execute({name,creator})
        return res.json(category)
        
    } catch (error) {
        console.log(error)
        if(error instanceof Error){
             return res.status(500).json({error:error.message})
        }
        else{
            return res.status(500).json({error: "failed to process request"})
        }
       
    }

    

})

categoriesRoutes.patch('/', async(req, res)=>{
    const {id} = req.query;
    const {name} = req.body;

    try{
        if(typeof(id)!= "string"){
            throw new Error("no valid query passed")
        }

    interface Request{
        id: string,
        name: string
    }
    const editCategory = new editCategoryService;

    const editedCategory = await editCategory.execute({id , name})

    return res.json(editedCategory)

    }
    catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
    

    //esta rota deve receber umnovo nome e editar a categoria,
    //return res.json({message:'edita uma categoria'})

})

categoriesRoutes.delete('/', (req, res)=>{
        const {id} = req.query;
    try{
        if(typeof(id)!= "string"){
            throw new Error("no valid query passed")
        }
        const deleteCategory = new deleteCategoryService;
        deleteCategory.execute(id)
        return res.send();
    }
    catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
    
    //esta rota deve receber um id deletar a categoria,
    //return res.json({message:'deleta uma categoria'})

})

export default categoriesRoutes;
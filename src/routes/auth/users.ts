import Router from "express";
import BlogError from "../../Errors";

import createUserService from "../../services/createUserService";
import deleteUserService from "../../services/deleteUserService";
import findUsersService from "../../services/findUsersService";
import updateUserService from "../../services/updateUserService";
const usersRoutes = Router();

interface User_Response{
    name:string,
    id:string,
    type:string,
    email:string
}

usersRoutes.get('/', async (req, res)=>{
    //lista todos os usuários
    //caso o usuário autenticado seja um admin ou supervisor,tamém lista os emails
    //e a data do último login
    try {
        const findUsers = new findUsersService;
        const users = await findUsers.execute();
        return res.json(users)
    } catch (err) {
        if(err instanceof Error){
            return res.json({error:err.message})
        }
        else{
            return res.json({error: "failed to process request"})
        }
        
    }

   // return res.json({message:'lista de nomes de usuário, id, permisões, data de adição '})
})

usersRoutes.post('/', async (req, res)=>{
    //cria um novo usuário, um usuário deve possuir permissões mais baixas que seu criador
    //recebe nome, email, password e permissões
    try{ //utiliza o try para tratamento de erros futuros
        
        const{name, email, type, passwd} = req.body; //recebe os parâmetros do body da request
        const user_object = {name, email, type, passwd};
            
        const createdUser= new createUserService(); //instancia uma nova classe do tipo createuserservice que efetuara as operações no db

        const user = await createdUser.execute(user_object); //chama a função execute, que cria um user

        const User_response:User_Response ={
            name: user.name,
            id: user.id,
            email:user.email,
            type:user.type
        }


        return res.json(User_response) //retorna como resultado da requisição
    }
    catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
    

    

    

   //    return res.json({message:'cria usuário com permissões menores que o criador'})
})

usersRoutes.patch('/', async (req, res)=>{
    try {
        const {user_id} = req.body;
    const {name, email} = req.body ;
        const updateUser = new updateUserService;
        const updatedUser = await updateUser.execute({id:user_id, name, email})   
        
        return res.json(updatedUser);
    }  catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
    
    //edita o seu próprio usuário, um user só pode editar ele mesmo
   // return res.json({message:'edita o usuário que está autenticado'})
})

usersRoutes.delete('/', async(req, res)=>{
    try {
        const {id} = req.query;

        if(typeof(id)!="string"){
            throw new BlogError("Invalid Id", 400);
            
        }

        const deleteUser = new deleteUserService;
        deleteUser.execute(id)
        return res.send();
    }   catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
    

    //deleta um usuário com permissões abaixo das suas, apenas o admin pode deletar qualquer user
    //um admin pode deletar outro admin
   // return res.json({message:'deleta um user com permissão menor que o user logado'})
})

export default usersRoutes;
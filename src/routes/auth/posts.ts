import Router from 'express'
import BlogError from '../../Errors';
import checkIfUserExistService from '../../services/checkIfUserExistService';
import createPostService from '../../services/createPostService';


import createUserService from '../../services/createUserService';  //serviço que efetivamente cria o usuário
import findCategoriesService from '../../services/findCategoriesService';


const authPostsRoutes = Router();

authPostsRoutes.post('/', async (req,res)=>{
    //esta rota cria um novo post, salvando seus parametros no db,
    //lembrando que um post deve ter um título, um preview e conteúdo categoria
    try{
        const {title, categories_id, preview, body,user_id} = req.body;
        const authorExist =new checkIfUserExistService
        const categoriesExist = new findCategoriesService;
        const categories = await categoriesExist.execute(categories_id)
        const author = await authorExist.execute(user_id);
        const createPost = new createPostService;
        const post = createPost.execute({
            title,
            categories,
            preview,
            body,
            author:user_id
        }) 
        return res.json(post)
    }
    catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }
    //return res.json({message:'esta rota deve criar um novo post'})
})
authPostsRoutes.patch('/', (req, res)=>{
    //esta rota deve possibilitar a edição de um post, 
    //permitindo a modificação de todos os seus parametros,
    // exceto data da criação
    return res.json({message:'esta rota deve editar um post'})
})
authPostsRoutes.put('/',(req, res)=>{
    //esta rota deve permitir a edição de parametros do post, 
    //não edita o conteúdo.
    return res.json({message:'esta rota deve editar os parametros de um post'})
})
authPostsRoutes.delete('/:id',(req, res)=>{
    //esta rota deve permitir a remoção de um post, por qualquer usuário 
    //que possua o mesmo nível de autoridade que o criador,
    return res.json({message:'esta rota remove um post'})
})

export default authPostsRoutes;
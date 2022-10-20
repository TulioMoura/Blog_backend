import { Router } from "express";

import authPostsRoutes from "./posts";
import categoriesRoutes from "./categories";
import usersRoutes from "./users";
import authUserService from "../../services/authUserService";
import authMiddleware from "../../middlewares/authMiddleware";
import BlogError from "../../Errors";
const authRoutes = Router();


authRoutes.post('/', async (req, res) => {
    //efetua a autenticação do usuário


    try {
        const { email, password: passwd } = req.body;
        const authUser = new authUserService();
        const { user, token } = await authUser.execute({ email, passwd })
        return res.json({ user, token })
    } catch (err) {
        if (err instanceof BlogError) {
            return res.status(err.code).json({ Error: err.message })
        }
        else {
            return res.status(500).json({ Error: "failed to process request" })
        }

    }

})
authRoutes.use(authMiddleware)
authRoutes.use('/categories', categoriesRoutes)
authRoutes.use('/users', usersRoutes)
authRoutes.use('/posts', authPostsRoutes)

export default authRoutes;
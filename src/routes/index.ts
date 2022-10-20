import { Router } from "express";

import authRoutes from "./auth";
import authPostsRoutes from "./auth/posts";
import publicRoutes from "./publicRoutes";
const routes = Router();

routes.use('/auth', authRoutes)


routes.use('/', publicRoutes)
export default routes;
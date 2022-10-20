import 'reflect-metadata';
import express, {json} from 'express';
import cors from 'cors'
import routes from './routes';


import { config } from 'dotenv';
import path from "path"
const env_filename = process.env.NODE_ENV === 'test' ?  "dev.env" :"test.env"
config({
    path: path.resolve(__dirname, ("../"+env_filename)) 
});
import './database'



 const app = express();
app.use(cors())


app.use(express.json())
app.use(routes);

export default app;
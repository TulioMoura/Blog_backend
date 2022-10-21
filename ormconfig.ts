import { config } from 'dotenv';
import path from "path"
const env_filename = process.env.NODE_ENV === 'test' ? "dev.env":  "test.env"

config({
    path: path.resolve(__dirname,env_filename) 
});


export default

{
    type:"postgres",
    url: process.env.DATABASE_URL,
    entities: [
        "./src/models/*.ts"
    ],
    migrations: [
        "./src/database/migrations/*.ts"
    ],
    cli: {
        "migrationsDir": "./src/database/migrations"
    }
}


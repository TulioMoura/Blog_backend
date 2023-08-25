import request from "supertest";
import { Connection, EntityManager, SimpleConsoleLogger,getManager } from "typeorm";
import app from "../../src/app"
import db_connection from "../../src/database/databaseTestingFunctions"

import { config } from 'dotenv';
import path from "path"
const env_filename = process.env.NODE_ENV === 'test' ? "dev.env":  "test.env"

config({
    path: path.resolve(__dirname,env_filename) 
});
const rootEmail = process.env.FIRSTUSEREMAIL
const rootPassword = process.env.FIRSTUSERPASSWORD


const title:string = "post_teste";
const preview:string = "exemplo de preview do post de teste criado";
const body:string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing";
let categories_id:string[] = [];


beforeAll(async () => {
    await db_connection.create()
    //login as administrator

    //console.log(rootEmail)
    //console.log(rootPassword)
    let  response = await (await request(app).post("/auth").send({
        email: rootEmail,
        password: rootPassword,
    })
    )

    //console.log(response.status)
    let token = response.body.token;

    //create an category to include in post

    response = await (await request(app).post("/auth/categories").set( "Authorization" , `Bearer ${token}`).send({
        name: "categoria_teste"
    }))
    console.log(response.body)
    categories_id.push(response.body.id)

    response = await (await request(app).post("/auth/categories").set( "Authorization" , `Bearer ${token}`).send({
        name: "nova_categoria_teste"
    }))
    console.log(response.body)
    categories_id.push(response.body.id)

    

    //uses the token and categories to create an simple post
    console.log(categories_id)
    response = await (await request(app).post("/auth/posts").set( "Authorization" , `Bearer ${token}`).send({
        title,
        preview,
        body,
        categories_id
    }))

    console.log(response.status)



})

afterAll(async () => {
    const entityManager =getManager();
    await entityManager.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
    await db_connection.close()
})
describe("Public Routes", () => {

    it("Should return created posts", async () => {

        const response = await (await request(app).get("/").send())
        expect(response.status).toBe(200);
        console.log(response)
    });
    
    return;

})
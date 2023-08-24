
import request from "supertest";
import { Connection, EntityManager, SimpleConsoleLogger,getManager } from "typeorm";
import app from "../../src/app"
import db_connection from "../../src/database/databaseTestingFunctions"
//DEFINE DEFAULT NAME, EMAIL AND PASSWORD TO USE IN TESTS

import { config } from 'dotenv';
import path from "path"
const env_filename = process.env.NODE_ENV === 'test' ? "dev.env":  "test.env"

config({
    path: path.resolve(__dirname,env_filename) 
});

const rootEmail = process.env.FIRSTUSEREMAIL
const rootPassword = process.env.FIRSTUSERPASSWORD

const supervisorUsername = "Tiago Moura"
const supervisorEmail = "tiagomoura@tdm.com"
const supervisorPassword = "12345678"


const editorUsername = "Leticia Moura"
const editorEmail = "leticiamoura@tdm.com"
const editorPassword = "açldfkçlkj"

let tokenRoot : string
let rootId:String;
let tokenSupervisor : string
let supervisorId:String;
let editorId:String;
let tokenEditor : string


beforeAll(async () => {
    await db_connection.create()

})

afterAll(async () => {
    const entityManager =getManager();
    await entityManager.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
    await db_connection.close()
})



describe("Authenticated Routes", () => {
    describe("Login route", () => {

        it("Shouldn't login with invalid json  ", async () => {

            const response = await (await request(app).post("/auth").send({
                email: 122123654,
                password: rootPassword,
            }))
            expect(response.status).toBe(400);

        });
        it("Shouldn't login with inexistant email ", async () => {

            const response = await (await request(app).post("/auth").send({
                email: "foo.bar@email.com",
                password: rootPassword,
            }))
            expect(response.status).toBe(400);

        });
        it("Shouldn't login without email ", async () => {

            const response = await (await request(app).post("/auth").send({
                password: rootPassword,
            }))
            expect(response.status).toBe(400);

        });




        it("Should login as root with email and password", async () => {

            const response = await (await request(app).post("/auth").send({
                email: rootEmail,
                password: rootPassword,
            })
            )

            expect(response.status).toBe(200);
            tokenRoot = response.body.token;

            expect(response.body.user.email).toBe(rootEmail)
            expect(response.body.user.name).toBe("root")
            expect(response.body.user.type).toBe("root")

            expect(tokenRoot).toBeDefined()
            return

        });
        return;

    })
    describe("After login", () => {
        it("Shouldn't create a new user with existent email", async () => {
            
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                email: rootEmail,
                passwd: supervisorPassword,
                type: "supervisor"
            })
            )

            expect(response.status).toBe(409);
            
            

        });
        it("Shouldn't create a new user as root",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                email: supervisorEmail,
                passwd: supervisorPassword,
                type: 'root'
            })
            )
            expect(response.status).toBe(400);
            
            
        });
        it("Shouldn't create a new user without username",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                email: supervisorEmail,
                passwd: supervisorPassword,
                type: 'supervisor'
            })
            )

            expect(response.status).toBe(400);
            
        });
        it("Shouldn't create a new user whithout email",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                passwd: supervisorPassword,
                type: 'supervisor'
            })
            )

            expect(response.status).toBe(400);
            
        });
        it("Shouldn't create a new user without password",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                email: supervisorEmail,
                type: 'supervisor'
            })
            )

            expect(response.status).toBe(400);
            
        });
        it("Shouldn't create a new user without type",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                email: supervisorEmail,
                passwd: supervisorPassword
            })
            )

            expect(response.status).toBe(400);
            
        });
        it("Shouldn't create a new user whith invalid type",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                email: supervisorEmail,
                passwd: supervisorPassword,
                type: 'aslçfkjasç'
            })
            )

            expect(response.status).toBe(400);
            
        })
        it("Should create a new supervisor user",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: supervisorUsername,
                email: supervisorEmail,
                passwd: supervisorPassword,
                type: 'supervisor'
            })
            )

            expect(response.status).toBe(200);
            
        })

        it("Should create a new editor user",async()=>{
            const response = await (await request(app).post("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).send({
                name: editorUsername,
                email: editorEmail,
                passwd: editorPassword,
                type: 'editor'
            })
            )

            expect(response.status).toBe(200);
            
        })

        return

    })
    describe("After create Users", ()=>{
        it("Should login as supervisor with email and password", async () => {

            const response = await (await request(app).post("/auth").send({
                email: supervisorEmail,
                password: supervisorPassword,
            })
            )

            expect(response.status).toBe(200);
            tokenSupervisor = response.body.token;
            supervisorId = response.body.user.id
            expect(response.body.user.email).toBe(supervisorEmail)
            expect(response.body.user.name).toBe("Tiago Moura")
            expect(response.body.user.type).toBe("supervisor")
            expect(supervisorId).toBeDefined();
            expect(tokenSupervisor).toBeDefined()
            return

        });
        it("Should login as editor with email and password", async () => {

            const response = await (await request(app).post("/auth").send({
                email: editorEmail,
                password: editorPassword,
            })
            )

            expect(response.status).toBe(200);
            tokenEditor = response.body.token;
            editorId = response.body.user.id;

            expect(response.body.user.email).toBe(editorEmail)
            expect(response.body.user.name).toBe("Leticia Moura")
            expect(response.body.user.type).toBe("editor")

            expect(editorId).toBeDefined();
            expect(tokenEditor).toBeDefined()
            return

        });
        return;
    })
      describe("After run tests",()=>{
        it("Should delete editor using supervisor token", async () => {

            const response = await (await (await request(app).delete("/auth/users").set( "Authorization" , `Bearer ${tokenSupervisor}`).query({id:editorId})
            ))

            expect(response.status).toBe(200);

            return

        });
        it("Should delete supervisor using root token", async () => {

            const response = await (await (await request(app).delete("/auth/users").set( "Authorization" , `Bearer ${tokenRoot}`).query({id:supervisorId})
            ))
        })
    
})
return;
})



 

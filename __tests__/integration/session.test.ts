
import request from "supertest";
import { Connection, SimpleConsoleLogger } from "typeorm";
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

let tokenRoot : string
let tokenSupervisor : string
let tokenEditor : string


beforeAll(async () => {
    await db_connection.create()

})

afterAll(async () => {
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




        it("Should login with email and password", async () => {

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
        return

    })

return;
})





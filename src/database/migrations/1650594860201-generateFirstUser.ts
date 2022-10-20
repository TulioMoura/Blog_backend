import {InsertQueryBuilder, MigrationInterface, QueryRunner} from "typeorm";
import { hash } from "bcryptjs";

import { config } from 'dotenv';
import path from "path"
const env_filename = process.env.NODE_ENV === 'test' ? "dev.env":  "test.env"

config({
    path: path.resolve(__dirname,env_filename) 
});

const rootMail = process.env.FIRSTUSEREMAIL

export class generateFirstUser1650594860201 implements MigrationInterface {
    name = 'generateFirstUser1650594860201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        if(!process.env.FIRSTUSERPASSWORD || !rootMail){
            throw new Error("Cannot find environment variables");
        }

        const rootPassword = await hash(process.env.FIRSTUSERPASSWORD,10);
        await queryRunner.query(`INSERT INTO "Users" VALUES (uuid_generate_v4() ,'root', '${rootMail}', '${rootPassword}','root') `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "Users" WHERE email ='${rootMail}';`)
    }

    

}

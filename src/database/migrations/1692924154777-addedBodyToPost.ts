import {MigrationInterface, QueryRunner} from "typeorm";

export class addedBodyToPost1692924154777 implements MigrationInterface {
    name = 'addedBodyToPost1692924154777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "body" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "body"`);
    }

}

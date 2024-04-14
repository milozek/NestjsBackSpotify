import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsInit1712951074902 implements MigrationInterface {
    name = 'MigrationsInit1712951074902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "playlistsId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_47d7ed5a5eac5e83619d7fb4f99" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_47d7ed5a5eac5e83619d7fb4f99"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "playlistsId"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
    }

}

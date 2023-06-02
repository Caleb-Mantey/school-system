import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1685387721921 implements MigrationInterface {
    name = 'InitialMigration1685387721921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`api_auths\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`api_key\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_4eb1826ad4db0d88807234c862\` (\`api_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`registered\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`push\` tinyint NOT NULL DEFAULT 0, \`email_notification\` tinyint NOT NULL DEFAULT 0, \`sms\` tinyint NOT NULL DEFAULT 0, \`phone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`account_type\` varchar(255) NOT NULL DEFAULT 'Admin', \`permissions\` varchar(255) NOT NULL DEFAULT 'Read', UNIQUE INDEX \`UQ_PHONE\` (\`phone\`), UNIQUE INDEX \`IDX_605f773f0197434dd12ab65277\` (\`phone\`), UNIQUE INDEX \`UQ_EMAILS\` (\`email\`), UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lecturer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`push\` tinyint NOT NULL DEFAULT 0, \`email_notification\` tinyint NOT NULL DEFAULT 0, \`sms\` tinyint NOT NULL DEFAULT 0, \`phone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`account_type\` varchar(255) NOT NULL DEFAULT 'Lecturer', UNIQUE INDEX \`UQ_PHONE\` (\`phone\`), UNIQUE INDEX \`IDX_319b02d3a8bfc4180166ca3f7f\` (\`phone\`), UNIQUE INDEX \`UQ_EMAILS\` (\`email\`), UNIQUE INDEX \`IDX_1c241d8627c0cead61a0898e51\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`student\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`push\` tinyint NOT NULL DEFAULT 0, \`email_notification\` tinyint NOT NULL DEFAULT 0, \`sms\` tinyint NOT NULL DEFAULT 0, \`phone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`account_type\` varchar(255) NOT NULL DEFAULT 'Student', UNIQUE INDEX \`UQ_PHONE\` (\`phone\`), UNIQUE INDEX \`IDX_bdd296b786640a32e5b7b0966b\` (\`phone\`), UNIQUE INDEX \`UQ_EMAILS\` (\`email\`), UNIQUE INDEX \`IDX_a56c051c91dbe1068ad683f536\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`super_admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UQ_EMAILS\` (\`email\`), UNIQUE INDEX \`IDX_1ce171ef935f892c7f13004f23\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`userAgent\` varchar(255) NOT NULL, \`ipAddress\` varchar(255) NOT NULL, \`account_type\` varchar(255) NOT NULL DEFAULT 'Rider', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_1ce171ef935f892c7f13004f23\` ON \`super_admin\``);
        await queryRunner.query(`DROP INDEX \`UQ_EMAILS\` ON \`super_admin\``);
        await queryRunner.query(`DROP TABLE \`super_admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_a56c051c91dbe1068ad683f536\` ON \`student\``);
        await queryRunner.query(`DROP INDEX \`UQ_EMAILS\` ON \`student\``);
        await queryRunner.query(`DROP INDEX \`IDX_bdd296b786640a32e5b7b0966b\` ON \`student\``);
        await queryRunner.query(`DROP INDEX \`UQ_PHONE\` ON \`student\``);
        await queryRunner.query(`DROP TABLE \`student\``);
        await queryRunner.query(`DROP INDEX \`IDX_1c241d8627c0cead61a0898e51\` ON \`lecturer\``);
        await queryRunner.query(`DROP INDEX \`UQ_EMAILS\` ON \`lecturer\``);
        await queryRunner.query(`DROP INDEX \`IDX_319b02d3a8bfc4180166ca3f7f\` ON \`lecturer\``);
        await queryRunner.query(`DROP INDEX \`UQ_PHONE\` ON \`lecturer\``);
        await queryRunner.query(`DROP TABLE \`lecturer\``);
        await queryRunner.query(`DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``);
        await queryRunner.query(`DROP INDEX \`UQ_EMAILS\` ON \`admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_605f773f0197434dd12ab65277\` ON \`admin\``);
        await queryRunner.query(`DROP INDEX \`UQ_PHONE\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP INDEX \`IDX_4eb1826ad4db0d88807234c862\` ON \`api_auths\``);
        await queryRunner.query(`DROP TABLE \`api_auths\``);
    }

}

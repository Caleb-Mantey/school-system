import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDatasource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/src/db/entities/*.entity{.ts,.js}'],
  migrations: ['dist/src/db/migrations/*{.ts,.js}'],
  synchronize: false,
});

AppDatasource.initialize();

export default AppDatasource;

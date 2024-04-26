import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  dialect: process.env.DB_DIALECT as 'mysql'
});

export default sequelize;

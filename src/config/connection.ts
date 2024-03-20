import { Sequelize } from 'sequelize';
import Config from './config';

const sequelize = new Sequelize({
  host: Config.databaseHost,
  username: Config.databaseUsername,
  password: Config.databasePassword,
  database: Config.databaseName,
  logging: Config.databaseLogging,
  dialect: Config.databaseDialect as 'mysql'
});

export default sequelize;

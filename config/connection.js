const { Sequelize } = require('sequelize');
const Config = require('./config')

const sequelize = new Sequelize({
  dialect: Config.databaseDialect,
  host: Config.databaseHost,
  username: Config.databaseUsername,
  password: Config.databasePassword,
  database: Config.databaseName,
  logging: Config.databaseLogging
});

module.exports = sequelize;
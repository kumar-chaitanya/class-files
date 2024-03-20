const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.STRING(36),
    autoIncrement: false,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('teacher', 'student'),
    allowNull: false
  }
});

module.exports = User;

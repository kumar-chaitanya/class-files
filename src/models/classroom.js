const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/connection');
const User = require('./user');

const Classroom = sequelize.define('classroom', {
  id: {
    type: DataTypes.STRING(36),
    autoIncrement: false,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Classroom.belongsTo(User, { foreignKey: { name: 'teacherId', allowNull: false }, as: 'teacher' });

module.exports = Classroom;

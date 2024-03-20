const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./user');
const Classroom = require('./classroom');

const File = sequelize.define('file', {
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
  },
  description: {
    type: DataTypes.TEXT
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

File.belongsTo(User, { foreignKey: { name: 'uploadedBy', allowNull: false }, as: 'uploader' });
File.belongsTo(Classroom, { foreignKey: { name: 'classroomId', allowNull: false }, as: 'classroom' });

module.exports = File;

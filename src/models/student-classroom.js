const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const StudentClassroom = sequelize.define('studentClassroom', {
    id: {
        type: DataTypes.STRING(36),
        autoIncrement: false,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

module.exports = StudentClassroom;

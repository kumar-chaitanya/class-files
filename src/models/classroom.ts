import { DataTypes } from 'sequelize';
import sequelize from '../config/connection';
import User from './user';

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

export default Classroom;

import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { UserRole } from '../types/custom.types';

@Table({
  timestamps: true
})
class User extends Model<User> {
  @Column({
    type: DataType.STRING(36),
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
    autoIncrement: false
  })
  id!: string;
  
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.ENUM('teacher', 'student'),
    allowNull: false
  })
  role!: UserRole
};

// const User = sequelize.define('user', {
//   id: {
//     type: DataTypes.STRING(36),
//     autoIncrement: false,
//     allowNull: false,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true
//   },
//   username: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   role: {
//     type: DataTypes.ENUM('teacher', 'student'),
//     allowNull: false
//   }
// });

export default User;

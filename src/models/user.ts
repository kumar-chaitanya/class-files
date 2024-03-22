import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { UserRole } from '../types/custom.types';
import Classroom from './classroom';
import UserClassroom from './user-classroom';

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
  role!: UserRole;

  @BelongsToMany(() => Classroom, () => UserClassroom)
  classrooms?: Classroom[]
};

export default User;

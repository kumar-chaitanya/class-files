import { Table, Column, Model, DataType, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import User from './user';
import UserClassroom from './user-classroom';

@Table({
  timestamps: true
})
class Classroom extends Model<Classroom> {
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
    allowNull: false
  })
  name!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(36),
    allowNull: false
  })
  createdById!: string;

  @BelongsToMany(() => User, () => UserClassroom)
  users?: User[]
};

export default Classroom;

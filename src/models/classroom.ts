import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { UserClassroom } from './user-classroom';

@Table({
  timestamps: true,
  tableName: 'classrooms'
})
export class Classroom extends Model<Classroom> {
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
  teacherId!: string;

  @BelongsTo(() => User)
  teacher!: User;

  @BelongsToMany(() => User, () => UserClassroom)
  users?: User[];
};

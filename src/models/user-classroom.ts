import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user';
import { Classroom } from './classroom';

@Table({
    timestamps: true
})
export class UserClassroom extends Model<UserClassroom> {
    @Column({
        type: DataType.STRING(36),
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING(36),
        allowNull: false
    })
    studentId!: string;

    @ForeignKey(() => Classroom)
    @Column({
        type: DataType.STRING(36),
        allowNull: false
    })
    classroomId!: string;
};

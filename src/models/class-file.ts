import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Classroom } from './classroom';

@Table({
    timestamps: true
})
export class ClassFile extends Model<ClassFile> {
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

    @Column({
        type: DataType.TEXT
    })
    description!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    type!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    path!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING(36),
        allowNull: false
    })
    uploadedBy!: string;

    @ForeignKey(() => Classroom)
    @Column({
        type: DataType.STRING(36),
        allowNull: false
    })
    classroomId!: string;

    @BelongsTo(() => User)
    author!: User;

    @BelongsTo(() => Classroom)
    classroom!: Classroom;
};

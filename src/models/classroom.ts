import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
};

// const Classroom = sequelize.define('classroom', {
//   id: {
//     type: DataTypes.STRING(36),
//     autoIncrement: false,
//     allowNull: false,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// });

// Classroom.belongsTo(User, { foreignKey: { name: 'teacherId', allowNull: false }, as: 'teacher' });

export default Classroom;

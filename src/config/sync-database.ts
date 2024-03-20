import sequelize from './connection';

import User from '../models/user';
import Classroom from '../models/classroom';
// import File from '../models/file';
import StudentClassroom from '../models/student-classroom';

User.belongsToMany(Classroom, { through: StudentClassroom, foreignKey: { name: 'studentId', allowNull: false } });
Classroom.belongsToMany(User, { through: StudentClassroom, foreignKey: { name: 'classroomId', allowNull: false } });

async function syncDatabase(): Promise<void> {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error in synchronizing database:', error);
    }
}

export default syncDatabase;
const sequelize = require('./connection');

const User = require('../models/user');
const Classroom = require('../models/classroom');
const File = require('../models/file');
const StudentClassroom = require('../models/student-classroom');

User.belongsToMany(Classroom, { through: StudentClassroom, foreignKey: { name: 'studentId', allowNull: false } });
Classroom.belongsToMany(User, { through: StudentClassroom, foreignKey: { name: 'classroomId', allowNull: false } });

async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error in synchronizing database:', error);
    }
}

module.exports = syncDatabase;
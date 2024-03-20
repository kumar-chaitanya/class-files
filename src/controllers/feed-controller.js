const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const Classroom = require('../models/classroom');
const File = require('../models/file');
const StudentClassroom = require('../models/student-classroom');

const getClassesFeed = async (req, res) => {
    try {
        let classes;

        // If the user is a teacher, fetch all classes created by the teacher
        if (req.user.role === 'teacher') {
            classes = await Classroom.findAll({ where: { teacherId: req.user.id } });
        } else {
            // If the user is a student, fetch classes the student is part of
            let getClassrooms = `SELECT 
            classrooms.*
        FROM
            users
                INNER JOIN
            studentClassrooms ON users.id = studentClassrooms.studentId
                INNER JOIN
            classrooms ON studentClassrooms.classroomId = classrooms.id
        WHERE
            users.id = '${req.user.id}';`;

            classes = await sequelize.query(getClassrooms, {
                type: Sequelize.QueryTypes.SELECT
            });
        }

        res.status(200).json({ classes });
    } catch (error) {
        console.error('Error fetching classes feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFilesFeed = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { type, search } = req.query;
        let files, classroomAccess;

        // Check if the authenticated user is authorized to access the files feed of this classroom
        if (req.user.role === 'teacher') {
            classroomAccess = await Classroom.findOne({ where: { id: classroomId, teacherId: req.user.id } });  
        } else if (req.user.role === 'student') {
            classroomAccess = await StudentClassroom.findOne({ where: { classroomId, studentId: req.user.id } });
        }

        if (!classroomAccess) {
            return res.status(403).json({ message: 'You are not authorized to access the file feed of this classroom' });
        }

        // If the user is a teacher, fetch all files for the classroom
        if (req.user.role === 'teacher') {
            let conditions = {
                where: {
                    classroomId,
                    uploadedBy: req.user.id,
                }
            };

            if (type) {
                conditions.where.type = {
                    [Sequelize.Op.like]: `%${type}%`
                };
            }

            if (search) {
                conditions.where.name = {
                    [Sequelize.Op.like]: `%${search}%`
                };
            }

            files = await File.findAll(conditions);
        } else {
            // If the user is a student, fetch files for the classroom visible to the student
            let getFiles = `SELECT 
            files.*
        FROM
            users
                INNER JOIN
            studentClassrooms ON users.id = studentClassrooms.studentId
                INNER JOIN
            files ON studentClassrooms.classroomId = files.classroomId
        WHERE
            users.id = '${req.user.id}'
                AND studentClassrooms.classroomId = '${classroomId}'`;

            if (type) getFiles += ` AND files.type LIKE '%${type}%'`;
            if (search) getFiles += ` AND files.name LIKE '%${search}%'`;

            files = await sequelize.query(getFiles, {
                type: Sequelize.QueryTypes.SELECT
            });
        }

        res.status(200).json({ files });
    } catch (error) {
        console.error('Error fetching files feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getClassesFeed, getFilesFeed };

import Sequelize from 'sequelize';
import sequelize from '../config/connection';
import { Classroom } from '../models/classroom';
import { ClassFile } from '../models/class-file';
import { UserClassroom } from '../models/user-classroom';
import { Request, Response } from 'express';
import { Where } from '../interfaces/custom.interfaces';

const getClassesFeed = async (req: Request, res: Response): Promise<void> => {
    try {
        let classes;

        // If the user is a teacher, fetch all classes created by the teacher
        if (req.user?.role === 'teacher') {
            classes = await Classroom.findAll({ where: { teacherId: req.user.id } });
        } else {
            // If the user is a student, fetch classes the student is part of
            let getClassrooms = `SELECT 
            classrooms.*
        FROM
            users
                INNER JOIN
            userClassrooms ON users.id = userClassrooms.studentId
                INNER JOIN
            classrooms ON userClassrooms.classroomId = classrooms.id
        WHERE
            users.id = '${req.user?.id}';`;

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

const getFilesFeed = async (req: Request, res: Response): Promise<void> => {
    try {
        const { classroomId } = req.params;
        const { type, search } = req.query;
        let files, classroomAccess;

        // Check if the authenticated user is authorized to access the files feed of this classroom
        if (req.user?.role === 'teacher') {
            classroomAccess = await Classroom.findOne({ where: { id: classroomId, teacherId: req.user.id } });
        } else if (req.user?.role === 'student') {
            classroomAccess = await UserClassroom.findOne({ where: { classroomId, studentId: req.user.id } });
        }

        if (!classroomAccess) {
            res.status(403).json({ message: 'You are not authorized to access the file feed of this classroom' });
            return;
        }

        // If the user is a teacher, fetch all files for the classroom
        if (req.user?.role === 'teacher') {
            let conditions: Where = {
                where: {
                    classroomId,
                    uploadedBy: req.user.id
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

            files = await ClassFile.findAll(conditions);
        } else {
            // If the user is a student, fetch files for the classroom visible to the student
            let getFiles = `SELECT 
            classFiles.*
        FROM
            users
                INNER JOIN
            userClassrooms ON users.id = userClassrooms.studentId
                INNER JOIN
            classFiles ON userClassrooms.classroomId = classFiles.classroomId
        WHERE
            users.id = '${req.user?.id}'
                AND userClassrooms.classroomId = '${classroomId}'`;

            if (type) getFiles += ` AND classFiles.type LIKE '%${type}%'`;
            if (search) getFiles += ` AND classFiles.name LIKE '%${search}%'`;

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

export { getClassesFeed, getFilesFeed };

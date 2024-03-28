import fs from 'fs';
import { Request, Response } from 'express';
import { User } from '../models/user';
import { Classroom } from '../models/classroom';
import { UserClassroom } from '../models/user-classroom';
import { ClassFile } from '../models/class-file';

const createClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const name: string = req.body.name;
        const teacherId: string | undefined = req.user?.id;
        
        if (name && teacherId) {
            let body = { name, teacherId } as Classroom;
            const classroom = await Classroom.create(body);
            res.status(201).json({ message: 'Classroom created successfully', classroom });
            return;
        }

        res.status(400).json({ message: 'Invalid request' });
        return;
    } catch (error) {
        console.error('Error creating classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

const updateClassroomDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            res.status(404).json({ message: 'Classroom not found' });
            return;
        }

        // Check if the authenticated user is the teacher of the classroom
        if (classroom.teacherId !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to update details of this classroom' });
            return;
        }

        // Update the classroom details
        await classroom.update({ name });

        res.status(200).json({ message: 'Classroom details updated successfully' });
    } catch (error) {
        console.error('Error updating classroom details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            res.status(404).json({ message: 'Classroom not found' });
            return;
        }

        // Check if the authenticated user is the teacher of the classroom
        if (classroom.teacherId !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to delete this classroom' });
            return;
        }

        // Delete all entries for the classroom from the junction table
        await UserClassroom.destroy({ where: { classroomId: id } });

        // Delete all the files for the classroom
        await ClassFile.destroy({ where: { classroomId: id } });

        // Delete the classroom
        await classroom.destroy();

        res.status(200).json({ message: 'Classroom and associated students deleted successfully' });
    } catch (error) {
        console.error('Error deleting classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addStudentToClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            res.status(404).json({ message: 'Classroom not found' });
            return;
        }

        // Check if the authenticated teacher is the owner of the classroom
        if (classroom.teacherId !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to add students to this classroom' });
            return;
        }

        // Check if the student exists
        const student = await User.findByPk(studentId);
        if (!student || student.role !== 'student') {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        // Check if the student is already assigned to the classroom
        const existingAssignment = await UserClassroom.findOne({ where: { studentId, classroomId: id } });
        if (existingAssignment) {
            res.status(400).json({ message: 'Student is already assigned to this classroom' });
            return;
        }

        // Create new assignment for the student in the classroom
        let body = { studentId, classroomId: id } as UserClassroom;
        await UserClassroom.create(body);

        res.status(200).json({ message: 'Student added to classroom successfully' });
    } catch (error) {
        console.error('Error adding student to classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteStudentFromClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            res.status(404).json({ message: 'Classroom not found' });
            return;
        }

        // Check if the authenticated teacher is the owner of the classroom
        if (classroom.teacherId !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to remove students from this classroom' });
            return;
        }

        // Check if the student is assigned to the classroom
        const assignment = await UserClassroom.findOne({ where: { studentId, classroomId: id } });
        if (!assignment) {
            res.status(404).json({ message: 'Student is not assigned to this classroom' });
            return;
        }

        // Delete the student's assignment from the classroom
        await assignment.destroy();

        res.status(200).json({ message: 'Student removed from classroom successfully' });
    } catch (error) {
        console.error('Error removing student from classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const shareFileToClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            res.status(404).json({ message: 'Classroom not found' });
            return;
        }

        // Check if the authenticated teacher is the owner of the classroom
        if (classroom.teacherId !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to add files to this classroom' });
            return;
        }

        // Create the file entry in the database
        let body = {
            name: req.file?.originalname,
            description,
            uploadedBy: req.user.id,
            type: req.file?.mimetype,
            classroomId: id,
            path: req.file?.path
        } as ClassFile;
        const file = await ClassFile.create(body);

        res.status(200).json({ message: 'File shared to classroom successfully', file });
    } catch (error) {
        console.error('Error sharing file to classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteFileFromClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileId } = req.params;

        // Find the file by fileId
        const file = await ClassFile.findByPk(fileId);

        // Check if the file exists
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Check if the authenticated user is the teacher who shared the file
        if (file.uploadedBy !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to delete this file' });
            return;
        }

        // Delete the file from the file system
        fs.unlinkSync(file.path);

        // Delete the file record from the database
        await file.destroy();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file from classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateFileInClassroom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileId } = req.params;
        const { description } = req.body;

        // Find the file by fileId
        const file = await ClassFile.findByPk(fileId);

        // Check if the file exists
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Check if the authenticated user is the teacher who shared the file
        if (file.uploadedBy !== req.user?.id) {
            res.status(403).json({ message: 'You are not authorized to delete this file' });
            return;
        }

        // Delete the previous file from the file system
        fs.unlinkSync(file.path);

        // Update file
        const updatedFile = {
            name: req.file?.originalname,
            description,
            uploadedAt: new Date(),
            uploadedBy: req.user.id,
            type: req.file?.mimetype,
            path: req.file?.path
        };
        await file.update(updatedFile);

        res.status(200).json({ message: 'File updated successfully', file });
    } catch (error) {
        console.error('Error deleting file from classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createClassroom,
    updateClassroomDetails,
    deleteClassroom,
    addStudentToClassroom,
    deleteStudentFromClassroom,
    shareFileToClassroom,
    updateFileInClassroom,
    deleteFileFromClassroom
};
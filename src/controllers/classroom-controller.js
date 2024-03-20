const fs = require('fs');
const User = require('../models/user');
const Classroom = require('../models/classroom');
const StudentClassroom = require('../models/student-classroom');
const File = require('../models/file');

const createClassroom = async (req, res) => {
    try {
        const { name } = req.body;
        const teacherId = req.user.id;

        const classroom = await Classroom.create({ name, teacherId });

        res.status(201).json({ message: 'Classroom created successfully', classroom });
    } catch (error) {
        console.error('Error creating classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateClassroomDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the authenticated user is the teacher of the classroom
        if (classroom.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update details of this classroom' });
        }

        // Update the classroom details
        await classroom.update({ name });

        res.status(200).json({ message: 'Classroom details updated successfully' });
    } catch (error) {
        console.error('Error updating classroom details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteClassroom = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the authenticated user is the teacher of the classroom
        if (classroom.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this classroom' });
        }

        // Delete all entries for the classroom from the junction table
        await StudentClassroom.destroy({ where: { classroomId: id } });

        // Delete all the files for the classroom
        await File.destroy({ where: { classroomId: id } });

        // Delete the classroom
        await classroom.destroy();

        res.status(200).json({ message: 'Classroom and associated students deleted successfully' });
    } catch (error) {
        console.error('Error deleting classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addStudentToClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the authenticated teacher is the owner of the classroom
        if (classroom.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to add students to this classroom' });
        }

        // Check if the student exists
        const student = await User.findByPk(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the student is already assigned to the classroom
        const existingAssignment = await StudentClassroom.findOne({ where: { studentId, classroomId: id } });
        if (existingAssignment) {
            return res.status(400).json({ message: 'Student is already assigned to this classroom' });
        }

        // Create new assignment for the student in the classroom
        await StudentClassroom.create({ studentId, classroomId: id });

        res.status(200).json({ message: 'Student added to classroom successfully' });
    } catch (error) {
        console.error('Error adding student to classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteStudentFromClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the authenticated teacher is the owner of the classroom
        if (classroom.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to remove students from this classroom' });
        }

        // Check if the student is assigned to the classroom
        const assignment = await StudentClassroom.findOne({ where: { studentId, classroomId: id } });
        if (!assignment) {
            return res.status(404).json({ message: 'Student is not assigned to this classroom' });
        }

        // Delete the student's assignment from the classroom
        await assignment.destroy();

        res.status(200).json({ message: 'Student removed from classroom successfully' });
    } catch (error) {
        console.error('Error removing student from classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const shareFileToClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        // Check if the classroom exists
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the authenticated teacher is the owner of the classroom
        if (classroom.teacherId !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to add files to this classroom' });
        }

        // Create the file entry in the database
        const file = await File.create({
            name: req.file.originalname,
            description,
            uploadedAt: new Date(),
            uploadedBy: req.user.id,
            type: req.file.mimetype,
            classroomId: id,
            path: req.file.path
        });

        res.status(200).json({ message: 'File shared to classroom successfully', file });
    } catch (error) {
        console.error('Error sharing file to classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteFileFromClassroom = async (req, res) => {
    try {
        const { fileId } = req.params;

        // Find the file by fileId
        const file = await File.findByPk(fileId);

        // Check if the file exists
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the authenticated user is the teacher who shared the file
        if (file.uploadedBy !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this file' });
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

const updateFileInClassroom = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { description } = req.body;

        // Find the file by fileId
        const file = await File.findByPk(fileId);

        // Check if the file exists
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the authenticated user is the teacher who shared the file
        if (file.uploadedBy !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this file' });
        }

        // Delete the previous file from the file system
        fs.unlinkSync(file.path);

        // Update file
        const updatedFile = {
            name: req.file.originalname,
            description,
            uploadedAt: new Date(),
            uploadedBy: req.user.id,
            type: req.file.mimetype,
            path: req.file.path
        };
        await file.update(updatedFile);

        res.status(200).json({ message: 'File updated successfully', file });
    } catch (error) {
        console.error('Error deleting file from classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createClassroom,
    updateClassroomDetails,
    deleteClassroom,
    addStudentToClassroom,
    deleteStudentFromClassroom,
    shareFileToClassroom,
    updateFileInClassroom,
    deleteFileFromClassroom
};
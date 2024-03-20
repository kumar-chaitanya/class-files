const File = require('../../models/file');
const StudentClassroom = require('../../models/student-classroom');
const path = require('path');
const fs = require('fs');

const downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        // Fetch the file from the database
        const file = await File.findByPk(fileId);

        // Check if the file exists
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the authenticated user is authorized to download the file
        if (req.user.role === 'teacher' && file.uploadedBy !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to download this file' });
        } else if (req.user.role === 'student') {
            let fileAccessExists = await StudentClassroom.findOne({ where: { classroomId: file.classroomId, studentId: req.user.id } });
            if (!fileAccessExists) return res.status(403).json({ message: 'You are not authorized to download this file' });
        }

        // Send the file as a download
        const stat = fs.statSync(file.path);

        res.writeHead(200, {
            'Content-Type': file.type,
            'Content-Length': stat.size,
            'Content-Disposition': `attachment; filename=${file.name}`
        });

        const readStream = fs.createReadStream(file.path);
        readStream.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { downloadFile };

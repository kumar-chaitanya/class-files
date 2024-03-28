import { ClassFile } from "../models/class-file";
import { UserClassroom } from "../models/user-classroom";
import fs from 'fs';
import { Request, Response } from "express";

const downloadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileId } = req.params;

        // Fetch the file from the database
        const file = await ClassFile.findByPk(fileId);

        // Check if the file exists
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Check if the authenticated user is authorized to download the file
        if (req.user?.role === 'teacher' && file.uploadedBy !== req.user.id) {
            res.status(403).json({ message: 'You are not authorized to download this file' });
            return;
        } else if (req.user?.role === 'student') {
            let fileAccessExists = await UserClassroom.findOne({ where: { classroomId: file.classroomId, studentId: req.user.id } });
            if (!fileAccessExists) {
                res.status(403).json({ message: 'You are not authorized to download this file' });
                return;
            }
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

export { downloadFile };

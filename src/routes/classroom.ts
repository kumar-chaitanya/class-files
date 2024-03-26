import express from 'express';
import multer from 'multer';
const router = express.Router();
import path from 'path';
const storage = multer.diskStorage({
    destination: `${path.join(__dirname, '..', '..', '/uploads/')}`,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

import {
    validateCreateClassroom, validateUpdateClassroomDetails,
    validateAddStudentToClassroom, validateDeleteStudentFromClassroom,
    handleValidationErrors
} from '../middlewares/validation';

import {
    createClassroom, updateClassroomDetails, deleteClassroom,
    addStudentToClassroom, deleteStudentFromClassroom,
    shareFileToClassroom, deleteFileFromClassroom, updateFileInClassroom
} from '../controllers/classroom-controller';

router.post('/', validateCreateClassroom, [handleValidationErrors], createClassroom);

router.put('/:id', validateUpdateClassroomDetails, [handleValidationErrors], updateClassroomDetails);

router.delete('/:id', deleteClassroom);

router.post('/:id/students', validateAddStudentToClassroom, [handleValidationErrors], addStudentToClassroom);

router.delete('/:id/students', validateDeleteStudentFromClassroom, [handleValidationErrors], deleteStudentFromClassroom);

router.post('/:id/files', upload.single('file'), shareFileToClassroom);

router.put('/files/:fileId', upload.single('file'), updateFileInClassroom);

router.delete('/files/:fileId', deleteFileFromClassroom);

export default router;

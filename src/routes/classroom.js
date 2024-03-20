const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const storage = multer.diskStorage({
    destination: `${path.join(__dirname, '..', '..', '/uploads/')}`,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

const {
    validateCreateClassroom, validateUpdateClassroomDetails,
    validateAddStudentToClassroom, validateDeleteStudentFromClassroom,
    handleValidationErrors
} = require('../middlewares/validation');

const {
    createClassroom, updateClassroomDetails, deleteClassroom,
    addStudentToClassroom, deleteStudentFromClassroom,
    shareFileToClassroom, deleteFileFromClassroom, updateFileInClassroom
} = require('../controllers/classroom-controller');

router.post('/', [validateCreateClassroom, handleValidationErrors], createClassroom);

router.put('/:id', [validateUpdateClassroomDetails, handleValidationErrors], updateClassroomDetails);

router.delete('/:id', deleteClassroom);

router.post('/:id/students', [validateAddStudentToClassroom, handleValidationErrors], addStudentToClassroom);

router.delete('/:id/students', [validateDeleteStudentFromClassroom, handleValidationErrors], deleteStudentFromClassroom);

router.post('/:id/files', upload.single('file'), shareFileToClassroom);

router.put('/files/:fileId', upload.single('file'), updateFileInClassroom);

router.delete('/files/:fileId', deleteFileFromClassroom);

module.exports = router;

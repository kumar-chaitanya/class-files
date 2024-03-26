import { validationResult, check } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware for authentication endpoint
const validateAuth = [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required')
];

// Middleware function to handle validation errors for classroom creation
const validateCreateClassroom = [
    check('name').notEmpty().withMessage('Name is required')
];

// Validation middleware for updating classroom details
const validateUpdateClassroomDetails = [
    check('name').notEmpty().withMessage('Name is required')
];

// Validation middleware for adding students to a classroom
const validateAddStudentToClassroom = [
    check('studentId').notEmpty().withMessage('Student ID is required')
];

// Validation middleware for deleting a student from a classroom
const validateDeleteStudentFromClassroom = [
    check('studentId').notEmpty().withMessage('Student ID is required')
];

// Middleware function to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
    return;
};

export {
    validateAuth,
    validateCreateClassroom,
    validateUpdateClassroomDetails,
    validateAddStudentToClassroom,
    validateDeleteStudentFromClassroom,
    handleValidationErrors
};

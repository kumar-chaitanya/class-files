import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/custom.types';

const checkRole = (role: UserRole) => (req: Request, res: Response, next: NextFunction): void => {
    if ((req.user)?.role !== role) {
        res.status(403).json({ message: `Only ${role}s are allowed to access this resource` });
        return;
    }
    next();
};

export default checkRole;

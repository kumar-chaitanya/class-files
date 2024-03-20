import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ReqUser } from '../interfaces/custom.interfaces';

declare global {
    namespace Express {
      interface Request {
        user?: ReqUser
      }
    }
  }

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        req.user = user;
        next();
    });
};

export default authenticate;

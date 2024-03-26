import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user';
import { ReqUser } from '../interfaces/custom.interfaces';

export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        if (!user.password) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const tokenBody: ReqUser = { id: user.id, username: user.username, role: user.role }; 
        const token = jwt.sign(tokenBody, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

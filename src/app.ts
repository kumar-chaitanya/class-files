import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';

import createDatabase from './config/create-database';
import syncDatabase from './config/sync-database';
import authenticate from './middlewares/authenticate';
import checkRole from './middlewares/check-role';

// const authRoutes = require('./routes/auth');
// const classroomRoutes = require('./routes/classroom');
// const feedRoutes = require('./routes/feed');
// const fileRoutes = require('./routes/file');

const app: Express = express();

app.use(express.json());

// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/classrooms', authenticate, checkRole('teacher'), classroomRoutes);
// app.use('/api/v1/feed', authenticate, feedRoutes);
// app.use('/api/v1/files', authenticate, fileRoutes);

const PORT: number = parseInt(process.env.PORT!) || 3000;

async function startApp(): Promise<void> {
    try {
        await createDatabase();
        await syncDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

startApp();

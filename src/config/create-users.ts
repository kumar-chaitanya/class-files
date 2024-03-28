import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserRole } from '../types/custom.types';

async function createUsers(): Promise<void> {
    try {
        const hashedPassword = await bcrypt.hash('password', 10);
        const teacherRole: UserRole = 'teacher';
        const studentRole: UserRole = 'student';

        await User.bulkCreate([
            { username: 'ruth', password: hashedPassword, role: teacherRole } as User,
            { username: 'adam', password: hashedPassword, role: teacherRole } as User,
            { username: 'beth', password: hashedPassword, role: teacherRole } as User,
            { username: 'jake', password: hashedPassword, role: teacherRole } as User
        ]);

        await User.bulkCreate([
            { username: 'alice', password: hashedPassword, role: studentRole } as User,
            { username: 'bob', password: hashedPassword, role: studentRole } as User,
            { username: 'charlie', password: hashedPassword, role: studentRole } as User,
            { username: 'diana', password: hashedPassword, role: studentRole } as User,
            { username: 'emma', password: hashedPassword, role: studentRole } as User,
            { username: 'sanya', password: hashedPassword, role: studentRole } as User,
            { username: 'caleb', password: hashedPassword, role: studentRole } as User,
            { username: 'dave', password: hashedPassword, role: studentRole } as User,
            { username: 'christina', password: hashedPassword, role: studentRole } as User,
            { username: 'susan', password: hashedPassword, role: studentRole } as User
        ]);

        console.log('Users created successfully');
    } catch (error) {
        console.error('Error creating users:', error);
    }
}

createUsers();

const bcrypt = require('bcrypt');
const User = require('../models/user');

async function createUsers() {
    try {
        const hashedPassword = await bcrypt.hash('password', 10);

        await User.bulkCreate([
            { username: 'ruth', password: hashedPassword, role: 'teacher' },
            { username: 'adam', password: hashedPassword, role: 'teacher' },
            { username: 'beth', password: hashedPassword, role: 'teacher' },
            { username: 'jake', password: hashedPassword, role: 'teacher' }
        ]);

        await User.bulkCreate([
            { username: 'alice', password: hashedPassword, role: 'student' },
            { username: 'bob', password: hashedPassword, role: 'student' },
            { username: 'charlie', password: hashedPassword, role: 'student' },
            { username: 'diana', password: hashedPassword, role: 'student' },
            { username: 'emma', password: hashedPassword, role: 'student' },
            { username: 'sanya', password: hashedPassword, role: 'student' },
            { username: 'caleb', password: hashedPassword, role: 'student' },
            { username: 'dave', password: hashedPassword, role: 'student' },
            { username: 'christina', password: hashedPassword, role: 'student' },
            { username: 'susan', password: hashedPassword, role: 'student' }
        ]);

        console.log('Users created successfully');
    } catch (error) {
        console.error('Error creating users:', error);
    }
}

createUsers();

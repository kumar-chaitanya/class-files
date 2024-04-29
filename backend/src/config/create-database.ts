import mysql from 'mysql2/promise';

async function createDatabase(): Promise<void> {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log('Database created successfully');
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

export default createDatabase;

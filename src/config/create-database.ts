import mysql from 'mysql2/promise';
import Config from './config';

async function createDatabase(): Promise<void> {
    try {
        const connection = await mysql.createConnection({
            host: Config.databaseHost,
            user: Config.databaseUsername,
            password: Config.databasePassword
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${Config.databaseName}`);
        console.log('Database created successfully');
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

export default createDatabase;

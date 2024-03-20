const mysql = require('mysql2/promise');
const Config = require('./config');

async function createDatabase() {
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

module.exports = createDatabase;

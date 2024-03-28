import sequelize from './connection';
import path from 'path';

async function syncDatabase(): Promise<void> {
    try {
        sequelize.addModels([path.join(__dirname, '..', '/models/')], (filename, member) => {
            return filename.replace('-', '').toLocaleLowerCase() === member.toLocaleLowerCase();
        });
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error in synchronizing database:', error);
    }
}

export default syncDatabase;
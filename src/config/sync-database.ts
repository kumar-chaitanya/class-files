import sequelize from './connection';

async function syncDatabase(): Promise<void> {
    try {
        sequelize.addModels([__dirname + '..' + '/models/*.ts'], (filename, member) => {
            return filename.replaceAll('-', '').toLocaleLowerCase() === member.toLocaleLowerCase();
        });
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error in synchronizing database:', error);
    }
}

export default syncDatabase;
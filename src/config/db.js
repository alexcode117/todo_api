import { Sequelize } from 'sequelize';
import { config } from './config.js';

const db = new Sequelize({
    dialect: 'mariadb',
    host: config.db.host, 
    username: config.db.username,
    password: config.db.password,
    database: config.db.dbName,
    port: config.db.port || 3306,
    dialectOptions: {
        connectTimeout: 1000 // Tiempo de espera para la conexión en ms
    }

})

export { db };
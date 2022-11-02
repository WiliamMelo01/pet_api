import { Sequelize } from 'sequelize';

import * as dotenv from 'dotenv';
dotenv.config();

const host = process.env.DB_HOST;
const user_database = process.env.DB_USER_DATABASE;
const password = process.env.DB_PASSWORD;

const database = new Sequelize(user_database, user_database, password, {
    host: host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }

});

export default database;
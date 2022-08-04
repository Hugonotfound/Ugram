import * as dotenv from 'dotenv';
dotenv.config();

const pool = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
};

const define = {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
    // paranoid: true
};

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: pool,
        define: define
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: pool,
        define: define
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: pool,
        define: define
    }
};

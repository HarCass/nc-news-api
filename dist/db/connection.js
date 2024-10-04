"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
const ENV = process.env.NODE_ENV || 'development';
const envPath = ENV === 'test' ? `${__dirname}/../.env.${ENV}` : `${__dirname}/../../.env.${ENV}`;
(0, dotenv_1.config)({
    path: envPath,
});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error('PGDATABASE or DATABASE_URL not set');
}
const dbConfig = ENV === 'production' ? {
    connectionString: process.env.DATABASE_URL,
    max: 3,
    ssl: { rejectUnauthorized: false }
} : {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.PGDATABASE,
};
const db = new pg_1.Pool(dbConfig);
exports.default = db;

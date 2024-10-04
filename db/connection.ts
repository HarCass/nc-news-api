import { Pool, PoolConfig } from 'pg';
import {config as envConfig} from 'dotenv';

const ENV = process.env.NODE_ENV || 'development';

const envPath = ENV === 'test' ? `${__dirname}/../.env.${ENV}` : `${__dirname}/../../.env.${ENV}`;

envConfig({
  path: envPath,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const dbConfig: PoolConfig = ENV === 'production' ? {
  connectionString: process.env.DATABASE_URL,
  max: 3
} : {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.PGDATABASE,
};

const db = new Pool(dbConfig);

export default db;

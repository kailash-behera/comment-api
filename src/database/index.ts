import 'dotenv/config';
import { Pool } from 'pg';

const generateConnection = () => {
    return `postgres://${process.env.PG_USER}:${process.env.PG_PWD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`;
}

const pool: Pool = new Pool({
    max: 20,
    connectionString: generateConnection(),
    idleTimeoutMillis: 30000
});

export const query = (sql: string, params: any[] = []) => {
    return pool.query(sql, params);
}
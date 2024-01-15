import db from '../db/connection';
import { DbRows, Topic } from '../types';

export const selectTopics = async () => {
    return db.query('SELECT * FROM topics')
    .then(({rows}: DbRows<Topic>) => rows);
}

export const insertTopic = async (slug: string, description: string) => {
    const sql = `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *
    `;
    return db.query(sql, [slug, description])
    .then(({rows} : DbRows<Topic>) => rows[0]);
}
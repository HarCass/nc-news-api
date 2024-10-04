import db from '../db/connection.js';
import { Topic } from '../types/index.js';

export const selectTopics = async () => {
    return db.query<Topic>('SELECT * FROM topics')
    .then(({rows}) => rows);
}

export const insertTopic = async (slug: string, description: string) => {
    const sql = `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *
    `;
    return db.query<Topic>(sql, [slug, description])
    .then(({rows}) => rows[0]);
}
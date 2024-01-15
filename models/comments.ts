import db from '../db/connection';
import { Comment, DbRows } from '../types';

export const removeCommentById = async (id: string) => {
    await db.query('DELETE FROM comments WHERE comment_id = $1', [id]);
}

export const checkCommentIdExists = async (id: string) => {
    await db.query('SELECT * FROM comments WHERE comment_id = $1', [id])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status:404, msg: 'ID Not Found'});
    });
}

export const updateCommentById = async (inc_votes: string, id: string) => {
    if(isNaN(+inc_votes)) return Promise.reject({status: 400, msg: 'Invalid Format'});
    return db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *', [inc_votes, id])
    .then(({rows}: DbRows<Comment>) => {
        if (rows.length) return rows[0];
        return Promise.reject({status: 404, msg: 'ID Not Found'});
    });
}

export const selectCommentById = async (id: string) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1', [id])
    .then(({rows}: DbRows<Comment>) => {
        if (rows.length) return rows[0];
        return Promise.reject({status: 404, msg: 'ID Not Found'})
    });
}
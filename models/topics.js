const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows}) => rows);
}

exports.insertTopic = (slug, description) => {
    const sql = `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *
    `
    return db.query(sql, [slug, description])
    .then(({rows}) => rows[0]);
}
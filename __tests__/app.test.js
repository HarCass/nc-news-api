const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('Unavailable Endpoint', () => {
    it('404: returns a status 404 and nothing else.', () => {
        return request(app)
        .get('/api/not_an_endpoint')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({});
        });
    });
});

describe('GET /api/topics', () => {
    it('200: returns an array of all the topics.', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body;
            expect(topics).toHaveLength(3);
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            });
        });
    });
});

describe('GET /api/articles/:article_id', () => {
    it('200: returns an article with the specified ID.', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 3,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            });
        });
    });
    it('400: returns a bad request if the ID is invalid.', () => {
        return request(app)
        .get('/api/articles/not_an_id')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if no article matches ID.', () => {
        return request(app)
        .get('/api/articles/9999999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
});

describe('GET /api/articles', () => {
    it('200: returns an array of all the articles, the articles should be sorted by date in descending order.', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body;
            expect(articles).toHaveLength(12);
            expect(articles).toBeSortedBy('created_at', {descending: true});
            articles.forEach(article => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                });
            });
        });
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('200: return the comments of the article with the specified ID ordered by most recent.', () => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments).toHaveLength(2);
            expect(comments).toBeSortedBy('created_at');
            comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 3
                });
            });
        });
    });
    it('400: returns a bad request if the ID is invalid.', () => {
        return request(app)
        .get('/api/articles/not_an_id/comments')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if there are no comments for given ID and ID does not exist.', () => {
        return request(app)
        .get('/api/articles/9999999/comments')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Comments Not Found');
        });
    });
    it('200: returns an empty array if the ID exists and there are no comments.', () => {
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body;
            expect(comments).toHaveLength(0);
        });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('201: adds given comment to the database and returns the added comment.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return request(app)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(201)
        .then(({body}) => {
            const {comment} = body;
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: 3,
                author: expect.any(String),
                votes: 0,
                created_at: expect.any(String)
            });
            return db.query('SELECT * FROM comments WHERE comment_id = $1', [comment.comment_id]);
        })
        .then(({rows}) => expect(rows[0]).not.toBe(undefined));
    });
    it('400: returns a bad request if the data to post is of the wrong format.', () => {
        const item = {bad: 'item'};
        return request(app)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('400: returns a bad request if the data to post is missing properties.', () => {
        const item = {username: 'lurker'};
        return request(app)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('404: returns a not found if the username is not in the database.', () => {
        const item = { username: 'HC62', body: 'This is a test comment.' };
        return request(app)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Username Not Found'));
    });
    it('400: returns a bad request if the ID is invalid.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return request(app)
        .post('/api/articles/not_an_id/comments')
        .send(item)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if no article matches ID.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return request(app)
        .post('/api/articles/9999999/comments')
        .send(item)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
});

describe.only('DELETE /api/comments/:comment_id', () => {
    it('204: returns a no content and deletes the specified comment from the database.', () => {
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
        .then(({body}) => expect(body).toEqual({}))
        .then(() => {
            return db.query('SELECT * FROM comments WHERE comment_id = 3')
        })
        .then(({rows}) => expect(rows).toEqual([]));
    });
    it('400: returns a bad request if the ID is invalid.', () => {
        return request(app)
        .delete('/api/comments/not_an_id')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
});
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
        })
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

describe('PATCH/api/articles/:article_id', () => {
    it('200: updates the votes of the specified article by the amount sent and returns the updated article.', () => {
        const item = {inc_votes: -10};
        return request(app)
        .patch('/api/articles/1')
        .send(item)
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 1,
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 90,
                article_img_url: expect.any(String),
                body: expect.any(String)
            });
        });
    });
    it('400: returns a bad request if the ID is invalid.', () => {
        const item = {inc_votes: 10};
        return request(app)
        .patch('/api/articles/not_an_id')
        .send(item)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if ID does not exist.', () => {
        const item = {inc_votes: 10};
        return request(app)
        .patch('/api/articles/9999999')
        .send(item)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
    it('400: returns a bad request if the data is missing inc_votes.', () => {
        const item = {};
        return request(app)
        .patch('/api/articles/3')
        .send(item)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid Format');
        });
    });
    it('400: returns a bad request if inc_votes value is not a number.', () => {
        const item = {inc_votes: 'Not a number'};
        return request(app)
        .patch('/api/articles/3')
        .send(item)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid Format');
        });
    });
});
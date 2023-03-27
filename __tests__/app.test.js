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
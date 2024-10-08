import app from '../app.js';
import db from '../db/connection.js';
import testData from '../db/data/test-data/index.js';
import endpointsJSON from '../endpoints.json';
import supertest from 'supertest';
import seed from '../db/seeds/seed.js';
import { afterAll, beforeEach, describe, it, expect } from 'vitest';
import { Article, ArticleResponse, ArticlesResponse, Comment, CommentResponse, CommentsResponse, Topic, TopicResponse, TopicsResponse, UserResponse, UsersResponse } from '../types/index.js';

afterAll(() => db.end());

beforeEach(async () => {
    await seed(testData);
    await app.ready();
});

describe('Unavailable Endpoint', () => {
    it('404: returns a status 404 and fastify error.', async () => {
        const route = '/api/not_an_endpoint';

        const res = await supertest(app.server).get(route);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({error: "Not Found", message: `Route GET:${route} not found`, statusCode: 404});
    });
});

describe('GET /api/topics', () => {
    it('200: returns an array of all the topics.', () => {
        return supertest(app.server)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics}: TopicsResponse = body;
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
        return supertest(app.server)
        .get('/api/articles/3')
        .expect(200)
        .then(({body}) => {
            const {article}: ArticleResponse = body;
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 3,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            });
        });
    });
    it('400: returns a bad supertest if the ID is invalid.', () => {
        return supertest(app.server)
        .get('/api/articles/not_an_id')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if no article matches ID.', () => {
        return supertest(app.server)
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
        return supertest(app.server)
        .get('/api/articles?limit=all')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toHaveLength(12);
            expect(articles).toStrictEqual(structuredClone(articles).sort((a, b) => b.created_at.localeCompare(a.created_at)));
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
    it('200: returns an array of all the articles of the specified topic if that topic exists, the articles should be sorted by date in descending order.', () => {
        return supertest(app.server)
        .get('/api/articles?topic=mitch&limit=all')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toHaveLength(11);
            expect(articles).toStrictEqual(structuredClone(articles).sort((a, b) => b.created_at.localeCompare(a.created_at)));
            articles.forEach(article => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'mitch',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                });
            });
        });
    });
    it('200: returns an empty array if the specified topic has no articles.', () => {
        return supertest(app.server)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toEqual([]);
        });
    });
    it('404: returns a not found if the topic does not exist.', () => {
        return supertest(app.server)
        .get('/api/articles?topic=not_a_topic')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Topic Not Found'));
    });
    it('200: returns an array of all the articles, the articles should be sorted by the specified column in descending order.', () => {
        return supertest(app.server)
        .get('/api/articles?sort_by=comment_count&limit=all')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toHaveLength(12);
            expect(articles).toStrictEqual(structuredClone(articles).sort((a, b) => b.comment_count - a.comment_count));
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
    it('400: returns a bad supertest if the specified column to sort by does not exist.', () => {
        return supertest(app.server)
        .get('/api/articles?sort_by=not_a_column')
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Sort'));
    });
    it('200: returns an array of all the articles, the articles should be ordered in asc or desc when specified.', () => {
        return supertest(app.server)
        .get('/api/articles?order=asc&limit=all')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toHaveLength(12);
            expect(articles).toStrictEqual(structuredClone(articles).sort((a, b) => a.created_at.localeCompare(b.created_at)));
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
    it('400: returns a bad supertest if the specified order is invalid.', () => {
        return supertest(app.server)
        .get('/api/articles?order=not_an_order')
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Order'));
    });
    it('200: returns a correct array of articles, with a combination of queries.', () => {
        return supertest(app.server)
        .get('/api/articles?topic=mitch&sort_by=author&order=asc&limit=all')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toHaveLength(11);
            expect(articles).toStrictEqual(structuredClone(articles).sort((a, b) => a.author.localeCompare(b.author)));
            articles.forEach(article => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'mitch',
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
        return supertest(app.server)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
            const {comments}: CommentsResponse = body;
            expect(comments).toHaveLength(2);
            expect(comments).toStrictEqual(structuredClone(comments).sort((a, b) => b.created_at.localeCompare(a.created_at)));
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
    it('400: returns a bad supertest if the ID is invalid.', () => {
        return supertest(app.server)
        .get('/api/articles/not_an_id/comments')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if ID does not exist.', () => {
        return supertest(app.server)
        .get('/api/articles/9999999/comments')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
    it('200: returns an empty array if the ID exists and there are no comments.', () => {
        return supertest(app.server)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
            const {comments}: CommentsResponse = body;
            expect(comments).toHaveLength(0);
        });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('201: adds given comment to the database and returns the added comment.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return supertest(app.server)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(201)
        .then(({body}) => {
            const {comment}: CommentResponse = body;
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
    it('400: returns a bad supertest if the data to post is of the wrong format.', () => {
        const item = {bad: 'item'};
        return supertest(app.server)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('400: returns a bad supertest if the data to post is missing properties.', () => {
        const item = {username: 'lurker'};
        return supertest(app.server)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('404: returns a not found if the username is not in the database.', () => {
        const item = { username: 'HC62', body: 'This is a test comment.' };
        return supertest(app.server)
        .post('/api/articles/3/comments')
        .send(item)
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Username Not Found'));
    });
    it('400: returns a bad supertest if the ID is invalid.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return supertest(app.server)
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
        return supertest(app.server)
        .post('/api/articles/9999999/comments')
        .send(item)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
});

describe('PATCH/api/articles/:article_id', () => {
    it('200: updates the votes of the specified article by the amount sent and returns the updated article.', () => {
        const item = {inc_votes: -10};
        return supertest(app.server)
        .patch('/api/articles/1')
        .send(item)
        .expect(200)
        .then(({body}) => {
            const {article}: ArticleResponse = body;
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
            return db.query<Article>('SELECT votes FROM articles WHERE article_id = 1')
        })
        .then(({rows}) => expect(rows[0].votes).toBe(90));
    });
    it('400: returns a bad supertest if the ID is invalid.', () => {
        const item = {inc_votes: 10};
        return supertest(app.server)
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
        return supertest(app.server)
        .patch('/api/articles/9999999')
        .send(item)
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
    it('400: returns a bad supertest if the data is missing inc_votes.', () => {
        const item = {};
        return supertest(app.server)
        .patch('/api/articles/3')
        .send(item)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid Format');
        });
    });
    it('400: returns a bad supertest if inc_votes value is not a number.', () => {
        const item = {inc_votes: 'Not a number'};
        return supertest(app.server)
        .patch('/api/articles/3')
        .send(item)
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid Format');
        });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('204: returns a no content and deletes the specified comment from the database.', () => {
        return supertest(app.server)
        .delete('/api/comments/3')
        .expect(204)
        .then(({body}) => expect(body).toEqual({}))
        .then(() => {
            return db.query('SELECT * FROM comments WHERE comment_id = 3')
        })
        .then(({rows}) => expect(rows).toEqual([]));
    });
    it('400: returns a bad supertest if the ID is invalid.', () => {
        return supertest(app.server)
        .delete('/api/comments/not_an_id')
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('Invalid ID');
        });
    });
    it('404: returns a not found if the ID does not exist.', () => {
        return supertest(app.server)
        .delete('/api/comments/99999')
        .expect(404)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe('ID Not Found');
        });
    });
});

describe('GET /api/users', () => {
    it('200: should return an array of all users.', () => {
        return supertest(app.server)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users}: UsersResponse = body;
            expect(users).toHaveLength(4);
            users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                });
            });
        });
    });
});

describe('GET /api', () => {
    it('200: returns a JSON of all the endpoints and their descirption.', () => {
        return supertest(app.server)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const {endpoints} = body;
            expect(endpoints).toEqual(endpointsJSON);
        });
    });
});

describe('GET /api/users/:username', () => {
    it('200: returns the specified user.', () => {
        return supertest(app.server)
        .get('/api/users/rogersop')
        .expect(200)
        .then(({body}) => {
            const {user}: UserResponse = body;
            expect(user).toMatchObject({
                username: 'rogersop',
                avatar_url: expect.any(String),
                name: expect.any(String)
            });
        });
    });
    it('404: returns a not found if the username does not exist.', () => {
        return supertest(app.server)
        .get('/api/users/not_a_user')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('User Not Found'));
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    it('200: updates the specified comments votes by the amount sent in the supertest and returns the updated comment.', () => {
        const item = { inc_votes: -10 };
        return supertest(app.server)
        .patch('/api/comments/3')
        .send(item)
        .expect(200)
        .then(({body}) => {
            const {comment}: CommentResponse = body;
            expect(comment).toMatchObject({
                comment_id: 3,
                body: expect.any(String),
                votes: 90,
                author: expect.any(String),
                article_id: expect.any(Number),
                created_at: expect.any(String)
            });
            return db.query<Comment>('SELECT votes FROM comments WHERE comment_id = 3');
        })
        .then(({rows}) => expect(rows[0].votes).toBe(90));
    });
    it('400: returns a bad supertest if the ID given is invalid.', () => {
        const item = { inc_votes: -10 };
        return supertest(app.server)
        .patch('/api/comments/not_an_id')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid ID'));
    });
    it('404: returns a not found if the ID given does not exist.', () => {
        const item = { inc_votes: -10 };
        return supertest(app.server)
        .patch('/api/comments/9999999')
        .send(item)
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('ID Not Found'));
    });
    it('400: returns a bad supertest if the supertest body is missing inc_votes.', () => {
        const item = { bad: 'item' };
        return supertest(app.server)
        .patch('/api/comments/3')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('400: returns a bad supertest if inc_votes is not a number.', () => {
        const item = { inc_votes: 'not a number' };
        return supertest(app.server)
        .patch('/api/comments/3')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
});

describe('POST /api/articles', () => {
    it('201: adds the article to the database and returns the new article.', () => {
        const item = {
            author: 'rogersop',
            title: '<3 Cats',
            body: 'Cats are cool.',
            topic: 'cats',
            article_img_url: 'https://someurl.net'
        };
        return supertest(app.server)
        .post('/api/articles')
        .send(item)
        .expect(201)
        .then(({body}) => {
            const {article}: ArticleResponse = body;
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: 'rogersop',
                title: '<3 Cats',
                body: 'Cats are cool.',
                topic: 'cats',
                article_img_url: 'https://someurl.net',
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0
            });
            return db.query('SELECT * FROM articles WHERE article_id = $1', [article.article_id]);
        })
        .then(({rows}) => expect(rows[0]).not.toBe(undefined));
    });
    it('201: adds the article to the database and returns the new article even if image url is missing.', () => {
        const item = {
            author: 'rogersop',
            title: '<3 Cats',
            body: 'Cats are cool.',
            topic: 'cats'
        };
        return supertest(app.server)
        .post('/api/articles')
        .send(item)
        .expect(201)
        .then(({body}) => {
            const {article}: ArticleResponse = body;
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: 'rogersop',
                title: '<3 Cats',
                body: 'Cats are cool.',
                topic: 'cats',
                article_img_url: expect.any(String),
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0
            });
        });
    });
    it('400: returns a bad supertest if the supertest body is missing properties.', () => {
        const item = {
            author: 'rogersop',
            body: 'Cats are cool.',
            topic: 'cats',
            article_img_url: 'https://someurl.net'
        };
        return supertest(app.server)
        .post('/api/articles')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('404: returns a bad supertest if the supertest body has an author username that does not exist.', () => {
        const item = {
            author: 'not_a_user',
            title: '<3 cats',
            body: 'Cats are cool.',
            topic: 'cats',
            article_img_url: 'https://someurl.net'
        };
        return supertest(app.server)
        .post('/api/articles')
        .send(item)
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Username Not Found'));
    });
    it('404: returns a bad supertest if the supertest body has a topic that does not exist.', () => {
        const item = {
            author: 'rogersop',
            title: '<3 cats',
            body: 'Cats are cool.',
            topic: 'not_a_topic',
            article_img_url: 'https://someurl.net'
        };
        return supertest(app.server)
        .post('/api/articles')
        .send(item)
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Topic Not Found'));
    });
});

describe('GET /api/articles Pagination', () => {
    describe('Limit Query', () => {
        it('200: returns an array of articles limited to 10 by defualt.', () => {
            return supertest(app.server)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const {articles}: ArticlesResponse = body;
                expect(articles).toHaveLength(10);
                articles.forEach(article => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
        });
        it('200: returns an array of articles limited to the specified amount.', () => {
            return supertest(app.server)
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({body}) => {
                const {articles}: ArticlesResponse = body;
                expect(articles).toHaveLength(5);
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
        it('400: should return a bad supertest if the limit is not a number or "all".', () => {
            return supertest(app.server)
            .get('/api/articles?limit=not_a_limit')
            .expect(400)
            .then(({body}) => expect(body.msg).toBe('Invalid Limit'));
        });
    });
    describe('Page Query', () => {
        it('200: returns normal result if p = 1.', () => {
            return supertest(app.server)
            .get('/api/articles?p=1')
            .expect(200)
            .then(({body}) => {
                const {articles}: ArticlesResponse = body;
                expect(articles).toHaveLength(10);
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
        it('200: returns correct result if p > 1.', () => {
            return supertest(app.server)
            .get('/api/articles?p=2')
            .expect(200)
            .then(({body}) => {
                const {articles}: ArticlesResponse = body;
                expect(articles).toHaveLength(2);
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
        it('200: returns an empty array if page out of range.', () => {
            return supertest(app.server)
            .get('/api/articles?p=3')
            .expect(200)
            .then(({body}) => {
                const {articles}: ArticlesResponse = body;
                expect(articles).toHaveLength(0);
            });
        });
        it('400: returns a bad supertest if p is not a number.', () => {
            return supertest(app.server)
            .get('/api/articles?p=not_a_number')
            .expect(400)
            .then(({body}) => expect(body.msg).toBe('Invalid Page'));
        });
    });
    describe('total_count Property', () => {
        it('200: returns an array of articles and a total_count in the response body.', () => {
            return supertest(app.server)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const {total_count}: ArticlesResponse = body;
                expect(total_count).toBe(12);
            });
        });
        it('200: returns an array of articles and a  correct total_count if given a valid topic.', () => {
            return supertest(app.server)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                const {total_count}: ArticlesResponse = body;
                expect(total_count).toBe(11);
            });
        });
    });
});

describe('GET /api/articles/:article_id/comments Pagination', () => {
    describe('Limit Query', () => {
        it('200: returns an array of comments limted to 10 by defualt.', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                const {comments}: CommentsResponse = body;
                expect(comments).toHaveLength(10);
                comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                    });
                });
            });
        });
        it('200: returns an array of comments limited to the specified amount.', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments?limit=5')
            .expect(200)
            .then(({body}) => {
                const {comments}: CommentsResponse = body;
                expect(comments).toHaveLength(5);
                comments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1
                    });
                });
            });
        });
        it('400: should return a bad supertest if the limit is not a number or "all".', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments?limit=not_a_limit')
            .expect(400)
            .then(({body}) => expect(body.msg).toBe('Invalid Limit'));
        });
    });
    describe('Page Query', () => {
        it('200: returns normal result if p = 1.', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments?p=1')
            .expect(200)
            .then(({body}) => {
                const {comments}: CommentsResponse = body;
                expect(comments).toHaveLength(10);
            });
        });
        it('200: returns correct result if p > 1.', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments?p=2')
            .expect(200)
            .then(({body}) => {
                const {comments}: CommentsResponse = body;
                expect(comments).toHaveLength(1);
            });
        });
        it('200: returns an empty array if p is out of range.', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments?p=99')
            .expect(200)
            .then(({body}) => {
                const {comments}: CommentsResponse = body;
                expect(comments).toHaveLength(0);
            });
        });
        it('400: returns a bad supertest if p is not a number.', () => {
            return supertest(app.server)
            .get('/api/articles/1/comments?p=not_a_number')
            .expect(400)
            .then(({body}) => expect(body.msg).toBe('Invalid Page'));
        });
    });
});

describe('POST /api/topics', () => {
    it('201: adds a new topic and returns the created topic.', () => {
        const item = {slug: 'newtopic', description: 'A new topic'}
        return supertest(app.server)
        .post('/api/topics')
        .send(item)
        .expect(201)
        .then(({body}) => {
            const {topic}: TopicResponse = body;
            expect(topic).toMatchObject({
                slug: 'newtopic',
                description: 'A new topic'
            });
            return db.query<Topic>("SELECT * FROM topics WHERE slug = 'newtopic'");
        })
        .then(({rows}) => expect(rows[0]).not.toBe(undefined));
    });
    it('400: returns a bad supertest if supertest body is missing slug.', () => {
        const item = {description: 'A new topic'}
        return supertest(app.server)
        .post('/api/topics')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('400: returns a bad supertest if topic already exists.', () => {
        const item = {slug: 'mitch', description: 'Not a new topic'}
        return supertest(app.server)
        .post('/api/topics')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
});

describe('DELETE /api/articles/:article_id', () => {
    it('204: deletes the specified article and returns no content.', () => {
        return supertest(app.server)
        .delete('/api/articles/1')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({});
            return db.query('SELECT * FROM articles WHERE article_id = 1');
        })
        .then(({rows}) => expect(rows).toEqual([]));
    });
    it('400: returns a bad supertest if ID is not a number.', () => {
        return supertest(app.server)
        .delete('/api/articles/not_an_id')
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid ID'));
    });
    it('404: returns a not found if article does not exist.', () => {
        return supertest(app.server)
        .delete('/api/articles/999999999')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('ID Not Found'))
    });
});

describe('GET /api/comments/:comment_id', () => {
    it('200: returns a comment of the specified ID.', () => {
        return supertest(app.server)
        .get('/api/comments/3')
        .expect(200)
        .then(({body}) => {
            const {comment}: CommentResponse = body;
            expect(comment).toMatchObject({
                comment_id: 3,
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
            });
        });
    });
    it('400: returns a bad supertest if the ID is invalid.', () => {
        return supertest(app.server)
        .get('/api/comments/not_an_id')
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid ID'));
    });
    it('404: returns a not found if the ID does not exist.', () => {
        return supertest(app.server)
        .get('/api/comments/9999999')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('ID Not Found'));
    });
});

describe('GET /api/users/:username/comments', () => {
    it('200: returns an array of all comments made by the specified user.', () => {
        return supertest(app.server)
        .get('/api/users/butter_bridge/comments')
        .expect(200)
        .then(({body}) => {
            const {comments}: CommentsResponse = body;
            expect(comments).toHaveLength(5)
            comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                });
            });
        });
    });
    it('200: returns an empty array if the specified user has not made any comments.', () => {
        return supertest(app.server)
        .get('/api/users/rogersop/comments')
        .expect(200)
        .then(({body}) => {
            const {comments}: CommentsResponse = body;
            expect(comments).toEqual([]);
        });
    });
    it('404: returns a not found if the username does not exist.', () => {
        return supertest(app.server)
        .get('/api/users/not_a_user/comments')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Username Not Found'));
    });
});

describe('POST /api/users', () => {
    it('201: adds user and returns added user.', () => {
        const item = {username: 'HC62', name:'Harry', avatar_url: 'some_url'};
        return supertest(app.server)
        .post('/api/users')
        .send(item)
        .expect(201)
        .then(({body}) => {
            const {user}: UserResponse = body;
            expect(user).toMatchObject({username: 'HC62', name:'Harry', avatar_url: 'some_url'});
            return db.query('SELECT * FROM users WHERE username = $1', [user.username]);
        })
        .then(({rows}) => expect(rows[0]).not.toBe(undefined));
    });
    it('400: returns a bad supertest if supertest body is missing name or username.', () => {
        const item = {name:'Harry', avatar_url: 'some_url'};
        return supertest(app.server)
        .post('/api/users')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
    it('400: returns a bad supertest if the username already exists.', () => {
        const item = {username: 'rogersop', name:'Roger', avatar_url: 'some_url'};
        return supertest(app.server)
        .post('/api/users')
        .send(item)
        .expect(400)
        .then(({body}) => expect(body.msg).toBe('Invalid Format'));
    });
});

describe('DELETE /api/users/:username', () => {
    it('204: removes the user and returns a no content.', () => {
        return supertest(app.server)
        .delete('/api/users/lurker')
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({});
            return db.query("SELECT * FROM users WHERE username = 'lurker'");
        })
        .then(({rows}) => expect(rows).toEqual([]));
    });
    it('404: returns not found if username does not exist.', () => {
        return supertest(app.server)
        .delete('/api/users/not_a_user')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Username Not Found'));
    });
});

describe('GET /api/users/:username/articles', () => {
    it('200: returns an array of articles posted by the specified user.', () => {
        return supertest(app.server)
        .get('/api/users/butter_bridge/articles')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toHaveLength(3)
            articles.forEach(article => {
                expect(article).toMatchObject({
                    author: 'butter_bridge',
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
    it('200: returns an empty array if the specified user has not made any articles.', () => {
        return supertest(app.server)
        .get('/api/users/lurker/articles')
        .expect(200)
        .then(({body}) => {
            const {articles}: ArticlesResponse = body;
            expect(articles).toEqual([]);
        });
    });
    it('404: returns not found if username does not exist.', () => {
        return supertest(app.server)
        .get('/api/users/not_a_user/articles')
        .expect(404)
        .then(({body}) => expect(body.msg).toBe('Username Not Found'));
    });
});

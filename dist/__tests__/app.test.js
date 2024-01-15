"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const connection_1 = __importDefault(require("../db/connection"));
const index_1 = __importDefault(require("../db/data/test-data/index"));
const endpoints_json_1 = __importDefault(require("../endpoints.json"));
const supertest_1 = __importDefault(require("supertest"));
const seed_1 = __importDefault(require("../db/seeds/seed"));
const vitest_1 = require("vitest");
(0, vitest_1.afterAll)(() => connection_1.default.end());
(0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () { yield (0, seed_1.default)(index_1.default); }));
(0, vitest_1.describe)('Unavailable Endpoint', () => {
    (0, vitest_1.it)('404: returns a status 404 and nothing else.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/not_an_endpoint')
            .expect(404)
            .then(({ body }) => {
            (0, vitest_1.expect)(body).toEqual({});
        });
    });
});
(0, vitest_1.describe)('GET /api/topics', () => {
    (0, vitest_1.it)('200: returns an array of all the topics.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
            const { topics } = body;
            (0, vitest_1.expect)(topics).toHaveLength(3);
            topics.forEach(topic => {
                (0, vitest_1.expect)(topic).toMatchObject({
                    slug: vitest_1.expect.any(String),
                    description: vitest_1.expect.any(String)
                });
            });
        });
    });
});
(0, vitest_1.describe)('GET /api/articles/:article_id', () => {
    (0, vitest_1.it)('200: returns an article with the specified ID.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body }) => {
            const { article } = body;
            (0, vitest_1.expect)(article).toMatchObject({
                author: vitest_1.expect.any(String),
                title: vitest_1.expect.any(String),
                article_id: 3,
                body: vitest_1.expect.any(String),
                topic: vitest_1.expect.any(String),
                created_at: vitest_1.expect.any(String),
                votes: vitest_1.expect.any(Number),
                article_img_url: vitest_1.expect.any(String),
                comment_count: vitest_1.expect.any(Number)
            });
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID is invalid.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/not_an_id')
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid ID');
        });
    });
    (0, vitest_1.it)('404: returns a not found if no article matches ID.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/9999999')
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('ID Not Found');
        });
    });
});
(0, vitest_1.describe)('GET /api/articles', () => {
    (0, vitest_1.it)('200: returns an array of all the articles, the articles should be sorted by date in descending order.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?limit=all')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toHaveLength(12);
            (0, vitest_1.expect)(articles).toStrictEqual(structuredClone(articles).sort((a, b) => b.created_at.localeCompare(a.created_at)));
            articles.forEach(article => {
                (0, vitest_1.expect)(article).toMatchObject({
                    author: vitest_1.expect.any(String),
                    title: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    topic: vitest_1.expect.any(String),
                    created_at: vitest_1.expect.any(String),
                    votes: vitest_1.expect.any(Number),
                    article_img_url: vitest_1.expect.any(String),
                    comment_count: vitest_1.expect.any(Number)
                });
            });
        });
    });
    (0, vitest_1.it)('200: returns an array of all the articles of the specified topic if that topic exists, the articles should be sorted by date in descending order.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?topic=mitch&limit=all')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toHaveLength(11);
            (0, vitest_1.expect)(articles).toStrictEqual(structuredClone(articles).sort((a, b) => b.created_at.localeCompare(a.created_at)));
            articles.forEach(article => {
                (0, vitest_1.expect)(article).toMatchObject({
                    author: vitest_1.expect.any(String),
                    title: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    topic: 'mitch',
                    created_at: vitest_1.expect.any(String),
                    votes: vitest_1.expect.any(Number),
                    article_img_url: vitest_1.expect.any(String),
                    comment_count: vitest_1.expect.any(Number)
                });
            });
        });
    });
    (0, vitest_1.it)('200: returns an empty array if the specified topic has no articles.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toEqual([]);
        });
    });
    (0, vitest_1.it)('404: returns a not found if the topic does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?topic=not_a_topic')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Topic Not Found'));
    });
    (0, vitest_1.it)('200: returns an array of all the articles, the articles should be sorted by the specified column in descending order.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?sort_by=comment_count&limit=all')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toHaveLength(12);
            (0, vitest_1.expect)(articles).toStrictEqual(structuredClone(articles).sort((a, b) => b.comment_count - a.comment_count));
            articles.forEach(article => {
                (0, vitest_1.expect)(article).toMatchObject({
                    author: vitest_1.expect.any(String),
                    title: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    topic: vitest_1.expect.any(String),
                    created_at: vitest_1.expect.any(String),
                    votes: vitest_1.expect.any(Number),
                    article_img_url: vitest_1.expect.any(String),
                    comment_count: vitest_1.expect.any(Number)
                });
            });
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the specified column to sort by does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?sort_by=not_a_column')
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Sort'));
    });
    (0, vitest_1.it)('200: returns an array of all the articles, the articles should be ordered in asc or desc when specified.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?order=asc&limit=all')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toHaveLength(12);
            (0, vitest_1.expect)(articles).toStrictEqual(structuredClone(articles).sort((a, b) => a.created_at.localeCompare(b.created_at)));
            articles.forEach(article => {
                (0, vitest_1.expect)(article).toMatchObject({
                    author: vitest_1.expect.any(String),
                    title: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    topic: vitest_1.expect.any(String),
                    created_at: vitest_1.expect.any(String),
                    votes: vitest_1.expect.any(Number),
                    article_img_url: vitest_1.expect.any(String),
                    comment_count: vitest_1.expect.any(Number)
                });
            });
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the specified order is invalid.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?order=not_an_order')
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Order'));
    });
    (0, vitest_1.it)('200: returns a correct array of articles, with a combination of queries.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles?topic=mitch&sort_by=author&order=asc&limit=all')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toHaveLength(11);
            (0, vitest_1.expect)(articles).toStrictEqual(structuredClone(articles).sort((a, b) => a.author.localeCompare(b.author)));
            articles.forEach(article => {
                (0, vitest_1.expect)(article).toMatchObject({
                    author: vitest_1.expect.any(String),
                    title: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    topic: 'mitch',
                    created_at: vitest_1.expect.any(String),
                    votes: vitest_1.expect.any(Number),
                    article_img_url: vitest_1.expect.any(String),
                    comment_count: vitest_1.expect.any(Number)
                });
            });
        });
    });
});
(0, vitest_1.describe)('GET /api/articles/:article_id/comments', () => {
    (0, vitest_1.it)('200: return the comments of the article with the specified ID ordered by most recent.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({ body }) => {
            const { comments } = body;
            (0, vitest_1.expect)(comments).toHaveLength(2);
            (0, vitest_1.expect)(comments).toStrictEqual(structuredClone(comments).sort((a, b) => b.created_at.localeCompare(a.created_at)));
            comments.forEach(comment => {
                (0, vitest_1.expect)(comment).toMatchObject({
                    comment_id: vitest_1.expect.any(Number),
                    votes: vitest_1.expect.any(Number),
                    created_at: vitest_1.expect.any(String),
                    author: vitest_1.expect.any(String),
                    body: vitest_1.expect.any(String),
                    article_id: 3
                });
            });
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID is invalid.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/not_an_id/comments')
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid ID');
        });
    });
    (0, vitest_1.it)('404: returns a not found if ID does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/9999999/comments')
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('ID Not Found');
        });
    });
    (0, vitest_1.it)('200: returns an empty array if the ID exists and there are no comments.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({ body }) => {
            const { comments } = body;
            (0, vitest_1.expect)(comments).toHaveLength(0);
        });
    });
});
(0, vitest_1.describe)('POST /api/articles/:article_id/comments', () => {
    (0, vitest_1.it)('201: adds given comment to the database and returns the added comment.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles/3/comments')
            .send(item)
            .expect(201)
            .then(({ body }) => {
            const { comment } = body;
            (0, vitest_1.expect)(comment).toMatchObject({
                comment_id: vitest_1.expect.any(Number),
                body: vitest_1.expect.any(String),
                article_id: 3,
                author: vitest_1.expect.any(String),
                votes: 0,
                created_at: vitest_1.expect.any(String)
            });
            return connection_1.default.query('SELECT * FROM comments WHERE comment_id = $1', [comment.comment_id]);
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows[0]).not.toBe(undefined));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the data to post is of the wrong format.', () => {
        const item = { bad: 'item' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles/3/comments')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the data to post is missing properties.', () => {
        const item = { username: 'lurker' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles/3/comments')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
    (0, vitest_1.it)('404: returns a not found if the username is not in the database.', () => {
        const item = { username: 'HC62', body: 'This is a test comment.' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles/3/comments')
            .send(item)
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Username Not Found'));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID is invalid.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles/not_an_id/comments')
            .send(item)
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid ID');
        });
    });
    (0, vitest_1.it)('404: returns a not found if no article matches ID.', () => {
        const item = { username: 'lurker', body: 'This is a test comment.' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles/9999999/comments')
            .send(item)
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('ID Not Found');
        });
    });
});
(0, vitest_1.describe)('PATCH/api/articles/:article_id', () => {
    (0, vitest_1.it)('200: updates the votes of the specified article by the amount sent and returns the updated article.', () => {
        const item = { inc_votes: -10 };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/articles/1')
            .send(item)
            .expect(200)
            .then(({ body }) => {
            const { article } = body;
            (0, vitest_1.expect)(article).toMatchObject({
                author: vitest_1.expect.any(String),
                title: vitest_1.expect.any(String),
                article_id: 1,
                topic: vitest_1.expect.any(String),
                created_at: vitest_1.expect.any(String),
                votes: 90,
                article_img_url: vitest_1.expect.any(String),
                body: vitest_1.expect.any(String)
            });
            return connection_1.default.query('SELECT votes FROM articles WHERE article_id = 1');
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows[0].votes).toBe(90));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID is invalid.', () => {
        const item = { inc_votes: 10 };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/articles/not_an_id')
            .send(item)
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid ID');
        });
    });
    (0, vitest_1.it)('404: returns a not found if ID does not exist.', () => {
        const item = { inc_votes: 10 };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/articles/9999999')
            .send(item)
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('ID Not Found');
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the data is missing inc_votes.', () => {
        const item = {};
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/articles/3')
            .send(item)
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid Format');
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if inc_votes value is not a number.', () => {
        const item = { inc_votes: 'Not a number' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/articles/3')
            .send(item)
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid Format');
        });
    });
});
(0, vitest_1.describe)('DELETE /api/comments/:comment_id', () => {
    (0, vitest_1.it)('204: returns a no content and deletes the specified comment from the database.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/comments/3')
            .expect(204)
            .then(({ body }) => (0, vitest_1.expect)(body).toEqual({}))
            .then(() => {
            return connection_1.default.query('SELECT * FROM comments WHERE comment_id = 3');
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows).toEqual([]));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID is invalid.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/comments/not_an_id')
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('Invalid ID');
        });
    });
    (0, vitest_1.it)('404: returns a not found if the ID does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/comments/99999')
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            (0, vitest_1.expect)(msg).toBe('ID Not Found');
        });
    });
});
(0, vitest_1.describe)('GET /api/users', () => {
    (0, vitest_1.it)('200: should return an array of all users.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
            const { users } = body;
            (0, vitest_1.expect)(users).toHaveLength(4);
            users.forEach(user => {
                (0, vitest_1.expect)(user).toMatchObject({
                    username: vitest_1.expect.any(String),
                    name: vitest_1.expect.any(String),
                    avatar_url: vitest_1.expect.any(String)
                });
            });
        });
    });
});
(0, vitest_1.describe)('GET /api', () => {
    (0, vitest_1.it)('200: returns a JSON of all the endpoints and their descirption.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
            const { endpoints } = body;
            (0, vitest_1.expect)(endpoints).toEqual(endpoints_json_1.default);
        });
    });
});
(0, vitest_1.describe)('GET /api/users/:username', () => {
    (0, vitest_1.it)('200: returns the specified user.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/rogersop')
            .expect(200)
            .then(({ body }) => {
            const { user } = body;
            (0, vitest_1.expect)(user).toMatchObject({
                username: 'rogersop',
                avatar_url: vitest_1.expect.any(String),
                name: vitest_1.expect.any(String)
            });
        });
    });
    (0, vitest_1.it)('404: returns a not found if the username does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/not_a_user')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('User Not Found'));
    });
});
(0, vitest_1.describe)('PATCH /api/comments/:comment_id', () => {
    (0, vitest_1.it)('200: updates the specified comments votes by the amount sent in the supertest and returns the updated comment.', () => {
        const item = { inc_votes: -10 };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/comments/3')
            .send(item)
            .expect(200)
            .then(({ body }) => {
            const { comment } = body;
            (0, vitest_1.expect)(comment).toMatchObject({
                comment_id: 3,
                body: vitest_1.expect.any(String),
                votes: 90,
                author: vitest_1.expect.any(String),
                article_id: vitest_1.expect.any(Number),
                created_at: vitest_1.expect.any(String)
            });
            return connection_1.default.query('SELECT votes FROM comments WHERE comment_id = 3');
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows[0].votes).toBe(90));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID given is invalid.', () => {
        const item = { inc_votes: -10 };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/comments/not_an_id')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid ID'));
    });
    (0, vitest_1.it)('404: returns a not found if the ID given does not exist.', () => {
        const item = { inc_votes: -10 };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/comments/9999999')
            .send(item)
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('ID Not Found'));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the supertest body is missing inc_votes.', () => {
        const item = { bad: 'item' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/comments/3')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
    (0, vitest_1.it)('400: returns a bad supertest if inc_votes is not a number.', () => {
        const item = { inc_votes: 'not a number' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/comments/3')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
});
(0, vitest_1.describe)('POST /api/articles', () => {
    (0, vitest_1.it)('201: adds the article to the database and returns the new article.', () => {
        const item = {
            author: 'rogersop',
            title: '<3 Cats',
            body: 'Cats are cool.',
            topic: 'cats',
            article_img_url: 'https://someurl.net'
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles')
            .send(item)
            .expect(201)
            .then(({ body }) => {
            const { article } = body;
            (0, vitest_1.expect)(article).toMatchObject({
                article_id: vitest_1.expect.any(Number),
                author: 'rogersop',
                title: '<3 Cats',
                body: 'Cats are cool.',
                topic: 'cats',
                article_img_url: 'https://someurl.net',
                votes: 0,
                created_at: vitest_1.expect.any(String),
                comment_count: 0
            });
            return connection_1.default.query('SELECT * FROM articles WHERE article_id = $1', [article.article_id]);
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows[0]).not.toBe(undefined));
    });
    (0, vitest_1.it)('201: adds the article to the database and returns the new article even if image url is missing.', () => {
        const item = {
            author: 'rogersop',
            title: '<3 Cats',
            body: 'Cats are cool.',
            topic: 'cats'
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles')
            .send(item)
            .expect(201)
            .then(({ body }) => {
            const { article } = body;
            (0, vitest_1.expect)(article).toMatchObject({
                article_id: vitest_1.expect.any(Number),
                author: 'rogersop',
                title: '<3 Cats',
                body: 'Cats are cool.',
                topic: 'cats',
                article_img_url: vitest_1.expect.any(String),
                votes: 0,
                created_at: vitest_1.expect.any(String),
                comment_count: 0
            });
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the supertest body is missing properties.', () => {
        const item = {
            author: 'rogersop',
            body: 'Cats are cool.',
            topic: 'cats',
            article_img_url: 'https://someurl.net'
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
    (0, vitest_1.it)('404: returns a bad supertest if the supertest body has an author username that does not exist.', () => {
        const item = {
            author: 'not_a_user',
            title: '<3 cats',
            body: 'Cats are cool.',
            topic: 'cats',
            article_img_url: 'https://someurl.net'
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles')
            .send(item)
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Username Not Found'));
    });
    (0, vitest_1.it)('404: returns a bad supertest if the supertest body has a topic that does not exist.', () => {
        const item = {
            author: 'rogersop',
            title: '<3 cats',
            body: 'Cats are cool.',
            topic: 'not_a_topic',
            article_img_url: 'https://someurl.net'
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/articles')
            .send(item)
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Topic Not Found'));
    });
});
(0, vitest_1.describe)('GET /api/articles Pagination', () => {
    (0, vitest_1.describe)('Limit Query', () => {
        (0, vitest_1.it)('200: returns an array of articles limited to 10 by defualt.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                const { articles } = body;
                (0, vitest_1.expect)(articles).toHaveLength(10);
                articles.forEach(article => {
                    (0, vitest_1.expect)(article).toMatchObject({
                        author: vitest_1.expect.any(String),
                        title: vitest_1.expect.any(String),
                        article_id: vitest_1.expect.any(Number),
                        topic: vitest_1.expect.any(String),
                        created_at: vitest_1.expect.any(String),
                        votes: vitest_1.expect.any(Number),
                        article_img_url: vitest_1.expect.any(String),
                        comment_count: vitest_1.expect.any(Number),
                    });
                });
            });
        });
        (0, vitest_1.it)('200: returns an array of articles limited to the specified amount.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?limit=5')
                .expect(200)
                .then(({ body }) => {
                const { articles } = body;
                (0, vitest_1.expect)(articles).toHaveLength(5);
                articles.forEach(article => {
                    (0, vitest_1.expect)(article).toMatchObject({
                        author: vitest_1.expect.any(String),
                        title: vitest_1.expect.any(String),
                        article_id: vitest_1.expect.any(Number),
                        topic: vitest_1.expect.any(String),
                        created_at: vitest_1.expect.any(String),
                        votes: vitest_1.expect.any(Number),
                        article_img_url: vitest_1.expect.any(String),
                        comment_count: vitest_1.expect.any(Number)
                    });
                });
            });
        });
        (0, vitest_1.it)('400: should return a bad supertest if the limit is not a number or "all".', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?limit=not_a_limit')
                .expect(400)
                .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Limit'));
        });
    });
    (0, vitest_1.describe)('Page Query', () => {
        (0, vitest_1.it)('200: returns normal result if p = 1.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?p=1')
                .expect(200)
                .then(({ body }) => {
                const { articles } = body;
                (0, vitest_1.expect)(articles).toHaveLength(10);
                articles.forEach(article => {
                    (0, vitest_1.expect)(article).toMatchObject({
                        author: vitest_1.expect.any(String),
                        title: vitest_1.expect.any(String),
                        article_id: vitest_1.expect.any(Number),
                        topic: vitest_1.expect.any(String),
                        created_at: vitest_1.expect.any(String),
                        votes: vitest_1.expect.any(Number),
                        article_img_url: vitest_1.expect.any(String),
                        comment_count: vitest_1.expect.any(Number)
                    });
                });
            });
        });
        (0, vitest_1.it)('200: returns correct result if p > 1.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?p=2')
                .expect(200)
                .then(({ body }) => {
                const { articles } = body;
                (0, vitest_1.expect)(articles).toHaveLength(2);
                articles.forEach(article => {
                    (0, vitest_1.expect)(article).toMatchObject({
                        author: vitest_1.expect.any(String),
                        title: vitest_1.expect.any(String),
                        article_id: vitest_1.expect.any(Number),
                        topic: vitest_1.expect.any(String),
                        created_at: vitest_1.expect.any(String),
                        votes: vitest_1.expect.any(Number),
                        article_img_url: vitest_1.expect.any(String),
                        comment_count: vitest_1.expect.any(Number)
                    });
                });
            });
        });
        (0, vitest_1.it)('200: returns an empty array if page out of range.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?p=3')
                .expect(200)
                .then(({ body }) => {
                const { articles } = body;
                (0, vitest_1.expect)(articles).toHaveLength(0);
            });
        });
        (0, vitest_1.it)('400: returns a bad supertest if p is not a number.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?p=not_a_number')
                .expect(400)
                .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Page'));
        });
    });
    (0, vitest_1.describe)('total_count Property', () => {
        (0, vitest_1.it)('200: returns an array of articles and a total_count in the response body.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                const { total_count } = body;
                (0, vitest_1.expect)(total_count).toBe(12);
            });
        });
        (0, vitest_1.it)('200: returns an array of articles and a  correct total_count if given a valid topic.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({ body }) => {
                const { total_count } = body;
                (0, vitest_1.expect)(total_count).toBe(11);
            });
        });
    });
});
(0, vitest_1.describe)('GET /api/articles/:article_id/comments Pagination', () => {
    (0, vitest_1.describe)('Limit Query', () => {
        (0, vitest_1.it)('200: returns an array of comments limted to 10 by defualt.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                const { comments } = body;
                (0, vitest_1.expect)(comments).toHaveLength(10);
                comments.forEach(comment => {
                    (0, vitest_1.expect)(comment).toMatchObject({
                        comment_id: vitest_1.expect.any(Number),
                        votes: vitest_1.expect.any(Number),
                        created_at: vitest_1.expect.any(String),
                        author: vitest_1.expect.any(String),
                        body: vitest_1.expect.any(String),
                        article_id: 1
                    });
                });
            });
        });
        (0, vitest_1.it)('200: returns an array of comments limited to the specified amount.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments?limit=5')
                .expect(200)
                .then(({ body }) => {
                const { comments } = body;
                (0, vitest_1.expect)(comments).toHaveLength(5);
                comments.forEach(comment => {
                    (0, vitest_1.expect)(comment).toMatchObject({
                        comment_id: vitest_1.expect.any(Number),
                        votes: vitest_1.expect.any(Number),
                        created_at: vitest_1.expect.any(String),
                        author: vitest_1.expect.any(String),
                        body: vitest_1.expect.any(String),
                        article_id: 1
                    });
                });
            });
        });
        (0, vitest_1.it)('400: should return a bad supertest if the limit is not a number or "all".', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments?limit=not_a_limit')
                .expect(400)
                .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Limit'));
        });
    });
    (0, vitest_1.describe)('Page Query', () => {
        (0, vitest_1.it)('200: returns normal result if p = 1.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments?p=1')
                .expect(200)
                .then(({ body }) => {
                const { comments } = body;
                (0, vitest_1.expect)(comments).toHaveLength(10);
            });
        });
        (0, vitest_1.it)('200: returns correct result if p > 1.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments?p=2')
                .expect(200)
                .then(({ body }) => {
                const { comments } = body;
                (0, vitest_1.expect)(comments).toHaveLength(1);
            });
        });
        (0, vitest_1.it)('200: returns an empty array if p is out of range.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments?p=99')
                .expect(200)
                .then(({ body }) => {
                const { comments } = body;
                (0, vitest_1.expect)(comments).toHaveLength(0);
            });
        });
        (0, vitest_1.it)('400: returns a bad supertest if p is not a number.', () => {
            return (0, supertest_1.default)(app_1.default)
                .get('/api/articles/1/comments?p=not_a_number')
                .expect(400)
                .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Page'));
        });
    });
});
(0, vitest_1.describe)('POST /api/topics', () => {
    (0, vitest_1.it)('201: adds a new topic and returns the created topic.', () => {
        const item = { slug: 'newtopic', description: 'A new topic' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/topics')
            .send(item)
            .expect(201)
            .then(({ body }) => {
            const { topic } = body;
            (0, vitest_1.expect)(topic).toMatchObject({
                slug: 'newtopic',
                description: 'A new topic'
            });
            return connection_1.default.query("SELECT * FROM topics WHERE slug = 'newtopic'");
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows[0]).not.toBe(undefined));
    });
    (0, vitest_1.it)('400: returns a bad supertest if supertest body is missing slug.', () => {
        const item = { description: 'A new topic' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/topics')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
    (0, vitest_1.it)('400: returns a bad supertest if topic already exists.', () => {
        const item = { slug: 'mitch', description: 'Not a new topic' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/topics')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
});
(0, vitest_1.describe)('DELETE /api/articles/:article_id', () => {
    (0, vitest_1.it)('204: deletes the specified article and returns no content.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/articles/1')
            .expect(204)
            .then(({ body }) => {
            (0, vitest_1.expect)(body).toEqual({});
            return connection_1.default.query('SELECT * FROM articles WHERE article_id = 1');
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows).toEqual([]));
    });
    (0, vitest_1.it)('400: returns a bad supertest if ID is not a number.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/articles/not_an_id')
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid ID'));
    });
    (0, vitest_1.it)('404: returns a not found if article does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/articles/999999999')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('ID Not Found'));
    });
});
(0, vitest_1.describe)('GET /api/comments/:comment_id', () => {
    (0, vitest_1.it)('200: returns a comment of the specified ID.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/comments/3')
            .expect(200)
            .then(({ body }) => {
            const { comment } = body;
            (0, vitest_1.expect)(comment).toMatchObject({
                comment_id: 3,
                author: vitest_1.expect.any(String),
                body: vitest_1.expect.any(String),
                article_id: vitest_1.expect.any(Number),
                votes: vitest_1.expect.any(Number),
                created_at: vitest_1.expect.any(String),
            });
        });
    });
    (0, vitest_1.it)('400: returns a bad supertest if the ID is invalid.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/comments/not_an_id')
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid ID'));
    });
    (0, vitest_1.it)('404: returns a not found if the ID does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/comments/9999999')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('ID Not Found'));
    });
});
(0, vitest_1.describe)('GET /api/users/:username/comments', () => {
    (0, vitest_1.it)('200: returns an array of all comments made by the specified user.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/butter_bridge/comments')
            .expect(200)
            .then(({ body }) => {
            const { comments } = body;
            (0, vitest_1.expect)(comments).toHaveLength(5);
            comments.forEach(comment => {
                (0, vitest_1.expect)(comment).toMatchObject({
                    comment_id: vitest_1.expect.any(Number),
                    author: vitest_1.expect.any(String),
                    body: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    votes: vitest_1.expect.any(Number),
                    created_at: vitest_1.expect.any(String),
                });
            });
        });
    });
    (0, vitest_1.it)('200: returns an empty array if the specified user has not made any comments.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/rogersop/comments')
            .expect(200)
            .then(({ body }) => {
            const { comments } = body;
            (0, vitest_1.expect)(comments).toEqual([]);
        });
    });
    (0, vitest_1.it)('404: returns a not found if the username does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/not_a_user/comments')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Username Not Found'));
    });
});
(0, vitest_1.describe)('POST /api/users', () => {
    (0, vitest_1.it)('201: adds user and returns added user.', () => {
        const item = { username: 'HC62', name: 'Harry', avatar_url: 'some_url' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(item)
            .expect(201)
            .then(({ body }) => {
            const { user } = body;
            (0, vitest_1.expect)(user).toMatchObject({ username: 'HC62', name: 'Harry', avatar_url: 'some_url' });
            return connection_1.default.query('SELECT * FROM users WHERE username = $1', [user.username]);
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows[0]).not.toBe(undefined));
    });
    (0, vitest_1.it)('400: returns a bad supertest if supertest body is missing name or username.', () => {
        const item = { name: 'Harry', avatar_url: 'some_url' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
    (0, vitest_1.it)('400: returns a bad supertest if the username already exists.', () => {
        const item = { username: 'rogersop', name: 'Roger', avatar_url: 'some_url' };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(item)
            .expect(400)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Invalid Format'));
    });
});
(0, vitest_1.describe)('DELETE /api/users/:username', () => {
    (0, vitest_1.it)('204: removes the user and returns a no content.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/users/lurker')
            .expect(204)
            .then(({ body }) => {
            (0, vitest_1.expect)(body).toEqual({});
            return connection_1.default.query("SELECT * FROM users WHERE username = 'lurker'");
        })
            .then(({ rows }) => (0, vitest_1.expect)(rows).toEqual([]));
    });
    (0, vitest_1.it)('404: returns not found if username does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/users/not_a_user')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Username Not Found'));
    });
});
(0, vitest_1.describe)('GET /api/users/:username/articles', () => {
    (0, vitest_1.it)('200: returns an array of articles posted by the specified user.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/butter_bridge/articles')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toHaveLength(3);
            articles.forEach(article => {
                (0, vitest_1.expect)(article).toMatchObject({
                    author: 'butter_bridge',
                    title: vitest_1.expect.any(String),
                    article_id: vitest_1.expect.any(Number),
                    topic: vitest_1.expect.any(String),
                    created_at: vitest_1.expect.any(String),
                    votes: vitest_1.expect.any(Number),
                    article_img_url: vitest_1.expect.any(String),
                    comment_count: vitest_1.expect.any(Number)
                });
            });
        });
    });
    (0, vitest_1.it)('200: returns an empty array if the specified user has not made any articles.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/lurker/articles')
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            (0, vitest_1.expect)(articles).toEqual([]);
        });
    });
    (0, vitest_1.it)('404: returns not found if username does not exist.', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/not_a_user/articles')
            .expect(404)
            .then(({ body }) => (0, vitest_1.expect)(body.msg).toBe('Username Not Found'));
    });
});

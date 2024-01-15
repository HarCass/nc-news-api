"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../db/seeds/utils");
const vitest_1 = require("vitest");
(0, vitest_1.describe)("convertTimestampToDate", () => {
    (0, vitest_1.test)("returns a new object", () => {
        const timestamp = 1557572706232;
        const testArticleData = {
            author: 'string',
            title: 'string',
            topic: 'string',
            created_at: timestamp,
            votes: 1,
            article_img_url: 'string',
            body: 'string'
        };
        const result = (0, utils_1.convertTimestampToDate)(testArticleData);
        (0, vitest_1.expect)(result).not.toBe(testArticleData);
        (0, vitest_1.expectTypeOf)(result).toBeObject();
    });
    (0, vitest_1.test)("converts a created_at property to a date for articleData", () => {
        const timestamp = 1557572706232;
        const testArticleData = {
            author: 'string',
            title: 'string',
            topic: 'string',
            created_at: timestamp,
            votes: 1,
            article_img_url: 'string',
            body: 'string'
        };
        const result = (0, utils_1.convertTimestampToDate)(testArticleData);
        (0, vitest_1.expect)(result).toHaveProperty('created_at');
        (0, vitest_1.expect)(result.created_at).instanceOf(Date);
        (0, vitest_1.expect)(result.created_at).toEqual(new Date(timestamp));
    });
    (0, vitest_1.test)("converts a created_at property to a date for commentData", () => {
        const timestamp = 1557572706232;
        const testCommentData = {
            author: 'string',
            created_at: timestamp,
            votes: 1,
            body: 'string',
            article_id: 1
        };
        const result = (0, utils_1.convertTimestampToDate)(testCommentData);
        (0, vitest_1.expect)(result).toHaveProperty('created_at');
        (0, vitest_1.expect)(result.created_at).instanceOf(Date);
        (0, vitest_1.expect)(result.created_at).toEqual(new Date(timestamp));
    });
    (0, vitest_1.test)("does not mutate the input", () => {
        const timestamp = 1557572706232;
        const testArticleData = {
            author: 'string',
            title: 'string',
            topic: 'string',
            created_at: timestamp,
            votes: 1,
            article_img_url: 'string',
            body: 'string'
        };
        const control = {
            author: 'string',
            title: 'string',
            topic: 'string',
            created_at: timestamp,
            votes: 1,
            article_img_url: 'string',
            body: 'string'
        };
        (0, utils_1.convertTimestampToDate)(testArticleData);
        (0, vitest_1.expect)(testArticleData).toEqual(control);
    });
    (0, vitest_1.test)("Does not change any other property in returned object", () => {
        const timestamp = 1557572706232;
        const testCommentData = {
            author: 'string',
            created_at: timestamp,
            votes: 1,
            body: 'string',
            article_id: 1
        };
        const result = (0, utils_1.convertTimestampToDate)(testCommentData);
        (0, vitest_1.expect)(result.author).toBe('string');
        (0, vitest_1.expect)(result.votes).toBe(1);
        (0, vitest_1.expect)(result.article_id).toBe(1);
        (0, vitest_1.expect)(result.body).toBe('string');
    });
});

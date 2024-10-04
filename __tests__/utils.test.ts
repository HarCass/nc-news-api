import { convertTimestampToDate } from "../db/seeds/utils.js";
import {describe, test, expect, expectTypeOf} from "vitest";
import { ArticleData, CommentData } from "../types/index.js";
  
  describe("convertTimestampToDate", () => {
    test("returns a new object", () => {
      const timestamp = 1557572706232;
      const testArticleData: ArticleData = {
        author: 'string',
        title: 'string',
        topic: 'string',
        created_at: timestamp,
        votes: 1,
        article_img_url: 'string',
        body: 'string'
      };

      const result = convertTimestampToDate(testArticleData);

      expect(result).not.toBe(testArticleData);
      expectTypeOf(result).toBeObject();
    });

    test("converts a created_at property to a date for articleData", () => {
      const timestamp = 1557572706232;
      const testArticleData: ArticleData = {
        author: 'string',
        title: 'string',
        topic: 'string',
        created_at: timestamp,
        votes: 1,
        article_img_url: 'string',
        body: 'string'
      };

      const result = convertTimestampToDate(testArticleData);

      expect(result).toHaveProperty('created_at');
      expect(result.created_at).instanceOf(Date);
      expect(result.created_at).toEqual(new Date(timestamp));
    });

    test("converts a created_at property to a date for commentData", () => {
      const timestamp = 1557572706232;
      const testCommentData: CommentData = {
        author: 'string',
        created_at: timestamp,
        votes: 1,
        body: 'string',
        article_id: 1
      };

      const result = convertTimestampToDate(testCommentData);

      expect(result).toHaveProperty('created_at');
      expect(result.created_at).instanceOf(Date);
      expect(result.created_at).toEqual(new Date(timestamp));
    });

    test("does not mutate the input", () => {
      const timestamp = 1557572706232;
      const testArticleData: ArticleData = {
        author: 'string',
        title: 'string',
        topic: 'string',
        created_at: timestamp,
        votes: 1,
        article_img_url: 'string',
        body: 'string'
      };
      const control: ArticleData = {
        author: 'string',
        title: 'string',
        topic: 'string',
        created_at: timestamp,
        votes: 1,
        article_img_url: 'string',
        body: 'string'
      };

      convertTimestampToDate(testArticleData);

      expect(testArticleData).toEqual(control);
    });

    test("Does not change any other property in returned object", () => {
      const timestamp = 1557572706232;
      const testCommentData: CommentData = {
        author: 'string',
        created_at: timestamp,
        votes: 1,
        body: 'string',
        article_id: 1
      };

      const result = convertTimestampToDate(testCommentData);

      expect(result.author).toBe('string');
      expect(result.votes).toBe(1);
      expect(result.article_id).toBe(1);
      expect(result.body).toBe('string');
    });
  });

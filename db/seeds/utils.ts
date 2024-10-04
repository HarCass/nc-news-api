import { ArticleData, ArticleDataFormatted, CommentData, CommentDataFormatted } from "../../types/index.js";

export function convertTimestampToDate(data: ArticleData): ArticleDataFormatted;
export function convertTimestampToDate(data: CommentData): CommentDataFormatted;
export function convertTimestampToDate(data: ArticleData | CommentData) {
  if (!data.created_at) return { ...data };
  return { ...data, created_at: new Date(data.created_at) } as ArticleDataFormatted | CommentDataFormatted;
};

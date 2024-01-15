export type Optional<T> = T | undefined

export type Article = {
    author: string,
    title: string,
    article_id: number,
    topic: string,
    created_at: string,
    votes: number,
    article_img_url: string,
    comment_count: number,
    body?: string
}

export type Comment = {
    comment_id: number,
    body: string,
    article_id: number,
    author:string,
    votes: number,
    created_at: string
}

export type Topic = {
    slug: string,
    description: string
}

export type User = {
    username: string,
    name: string,
    avatar_url: string
}

export type ArticlesResponse = {
    articles: Article[],
    total_count: number
}

export type ArticleResponse = {
    article: Article
}

export type CommentsResponse = {
    comments: Comment[]
}

export type CommentResponse = {
    comment: Comment
}

export type TopicsResponse = {
    topics: Topic[]
}

export type TopicResponse = {
    topic: Topic
}

export type UsersResponse = {
    users: User[]
}

export type UserResponse = {
    user: User
}

export type GetArticlesParams = {
    topic: Optional<string>,
    sort_by: Optional<string>,
    order: Optional<string>,
    limit: Optional<string>,
    p: Optional<string>
}

export type getCommentsParams = {
    limit: Optional<string>,
    p: Optional<string>
}

export type NewArticle = {
    author: string,
    title: string,
    topic: string,
    body: string,
    article_img_url: string
}

export type NewComment = {
    username: string,
    body: string
}

export type NewVote = {
    inc_votes: number
}

export type ArticleData = {
    author: string,
    title: string,
    topic: string,
    created_at: number,
    votes: number,
    article_img_url: string,
    body: string
}

export type ArticleDataFormatted = {
    author: string,
    title: string,
    topic: string,
    created_at: Date,
    votes: number,
    article_img_url: string,
    body: string
}

export type CommentData = {
    body: string,
    article_id: number,
    author:string,
    votes: number,
    created_at: number
}

export type CommentDataFormatted = {
    body: string,
    article_id: number,
    author:string,
    votes: number,
    created_at: Date
}

export type SeedData = {
    articleData: ArticleData[],
    commentData: CommentData[],
    topicData: Topic[],
    userData: User[]
}

export type DbRows<T> = {
    rows: T[]
}

export type DbArticles = [
    {
        rows: Article[]
    },
    {
        rowCount: number | null
    }
]

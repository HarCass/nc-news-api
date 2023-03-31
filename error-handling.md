# Possible Errors

This is a guide to the possible errors that may happen in the app.

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## Unavailable Routes

### GET `/not-a-route`

- Status: 404

---

## Available Routes

### GET `/api/topics`


### GET `/api/users/:username`

- 404: Provided `username` that doesn't exist in the database

### GET `/api/articles/:article_id`

- 400: Bad `article_id` (e.g. `/dog`)
- 404: Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### PATCH `/api/articles/:article_id`

- 404: Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- 400: No `inc_votes` on request body
- 400: Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### POST `/api/articles/:article_id/comments`

- 400: Bad `article_id` (e.g. `/dog`)
- 404: Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)
- 404: `username` that does not exist
- 400: Data to post in bad format (e.g {bad: 'format'})
- 400: Missing properties on request body (e.g. `{username: 'something'}`)

### GET `/api/articles/:article_id/comments`

- 400: Bad `article_id` (e.g. `/dog`)
- 404: Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### GET `/api/articles`

- 400: Bad queries:
  - `sort_by` a column that doesn't exist
  - `order` !== "asc" / "desc"
  - `topic` that is not in the database
  - `limit` not = an integer or 'all'
  - `p` not = an integer

### PATCH `/api/comments/:comment_id`

- 404: Well formed `comment_id` that doesn't exist in the database (e.g. `/999999`)
- 400: No `inc_votes` on request body
- 400: Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)

### DELETE `/api/comments/:comment_id`

- 404: `comment_id` that is not in database

### GET `/api`


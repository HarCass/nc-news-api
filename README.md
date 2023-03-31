# Northcoders News API
Live version: https://hc-nc-news-api.onrender.com/api
- - - 
## Summary
- - -
This is an API designed to query an SQL database, containing information about news articles, via multiple endpoints using the CRUD, REST and MVC methodoligies. This is achieved via Node JS and Postgres (PSQL), using node express to develop the application and node pg to query the database.

## Setup Instructions
- - -
### Cloning the Repo
To clone this repo you must have git installed on your system. Then navigate to the desired location you want the repo to be contained in and run the following command in your terminal
> `git clone https://github.com/HarCass/nc-news-api`

You may be prompted for your github details.
### Installing dependencies
Once the repo is cloned you can navigate inside of it and install the needed dependencies for the application. To do so you must have at least Node version 18.13.0 installed and run the following in the terminal
>`npm install`
### Database setup
Now that dependencies are installed you can setup your databases. To do so you must have at least Postgres version 12.14 installed and run the following in your terminal
>`npm run setup-dbs`

This will create a development and test database named `nc_news` and `nc_news_test` respectfully.

If you wish to change the names of the databases you can do so by editing the `setup.sql` file in the db folder.
### Environment Setup
To successfully connect to the databases locally you must first setup your environment variables.

To do so, please create two files in the root directory `.env.test` and `.env.development`.

The content of the files should look something like this
- For the development file `PGDATABASE=database_name_here`
- For the test file `PGDATABASE=database_name_here_test`
### Seeding the Database
Once you have setup the `.env` files you can run the following command in your temrinal to seed your development database
>`npm run seed`

This will seed the development database, you can then view it via Postgres in your terminal or run 
>`node listen.js`

this will start the application so you can interact with the databse via the API (You can make requests to it with an application such as insomnia, the application runs on PORT 8080 by default).

If you wish to also seed the test database you can do so by running the following in your terminal
>`npm test app`

This will run some tests for the application to make sure it is working correctly and simultaneously seed the test databse.
### Making a Request to the API
Make a GET request to the endpoint `/api` to get a list of available endpoints.
### Errors
See `error-handling.md`.
const app = require ('./app');

const {PORT = 9090} = process.env;

app.listen(PORT, (err: Error) => {
    if (err) console.log(err);
    else console.log(`Server listening on Port ${PORT}...`);
});
import app from './app';

const {PORT = 9090} = process.env;

app.listen(PORT)
.on('listening', () => {
    console.log(`Server listening on Port ${PORT}...`);
})
.on('error', (err: Error) => {
    console.log(err);
});
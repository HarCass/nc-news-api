import app from "./app.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9090;

app.listen({port: PORT, host: "0.0.0.0"}, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server running on ${PORT} ...`);
});
import app from "./app.js";

app.listen({port: 9090}, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Server running ...");
});
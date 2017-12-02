if(process.argv[2] === "koa"){
    require("./test.koa");
    return;
}

const app = require("express")(); // Install express first.
const cors = require("./");

// Try making a xhr request at 'github.com' to 'localhost:3000', set a custom
// header 'X-Requested-With'.
// The route accepts any kind of methods, but at `github.com`, only 'GET' will
// be allowed.

app.use("*", cors.express({
    origins: "*.github.com",
    methods: "GET",
    headers: "x-requested-with",
}));

app.all("/", (req, res)=>{
    res.send("Hello, World!");
});

app.listen(3000, ()=>{
    console.log("Test server started!");
});
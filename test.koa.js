const Koa = require("koa");
const cors = require("./");
const app = new Koa();

app.use(cors.koa({
    origins: "*.google.com",
    methods: "GET",
    headers: "x-requested-with",
}));

app.use(ctx => {
    ctx.body = "Hello, World!";
});

app.listen(3000, () => {
    console.log("Test server started!");
});
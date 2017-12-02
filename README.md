# SFN-CORS

**Safe Featured Node.js CORS handler.**

## Install

```sh
npm install sfn-cors --save
```

## Example

```javascript
const app = require("express")(); // Install express first.
const cors = require("sfn-cors");

// Try making a xhr request at 'google.com' to 'localhost:3000', set a custom
// header 'X-Requested-With'.
// The route accepts any kind of methods, but at `google.com`, only 'GET' will
// be allowed.

app.use("*", cors.express({
    origins: "*.google.com",
    methods: "GET",
    headers: "x-requested-with",
}));

app.all("/", (req, res)=>{
    res.send("Hello, World!");
});

app.listen(3000, ()=>{
    console.log("Test server started!");
});
```

### Or with Koa:

```javascript
const Koa = require("koa");
const cors = require("sfn-cors");
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
```

### For other frameworks or native Node.js server

This module can be run with any frameworks or native Node.js server, it 
doesn't rely on any framework.

## API

### `cors(options: Any, req: ClientRequest, res: ServerResponse): Boolean`

Apply access control checking.

- `options` Could be an `*`, a `true` to accept all origins. Or set a hostname
    to accept a specified origin. Or an object contains: 
    `{ origins, methods, headers, credentials, maxAge, exposeHeaders }`.
    See [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) for more details.
- `req` The corresponding request.
- `res` The corresponding response.

Returns `true` if access control checking succeeded, `false` otherwise.

This function extends legacy CORS Access Control Checking, it allows you 
checking multiple origins in multiple forms. Possible hosts specification 
are:

- `https://github.com` allow only https scheme for this host
- `http://github.com` allow only http scheme for this host
- `github.com` allow any scheme for this host
- `*.github.com` allow any sub-domain including second-level domain itself
- `https://*.github.com` same as above but restrict for https only
- `github.com:*` allow any port for this host
- `*.github.com:*` allow any port for this host and any sub-domain
- `https://*.github.com:*` same as above but restrict for https only

Some browsers, like Chrome, won't check `Access-Control-Allow-Methods` and 
`Access-Control-Allow-Headers`, or check weakly, but using this module,
methods and headers are always strictly checked.

when Access Control Checking failed, or the request method is `OPTIONS` 
(whatever succeeded or failed), the connection should be immediately 
terminated and no more actions will run after that.

### `cors.express(options: Any)`

Middleware for Express framework.

### `cors.koa(options: Any)`

Middleware for Koa framework.
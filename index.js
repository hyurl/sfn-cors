const url = require("url");
const trimmer = require("string-trimmer");

/**
 * Apply access control checking.
 * 
 * This function extends legacy CORS Access Control Checking, it allows you 
 * checking multiple origins in multiple forms. Possible hosts specification 
 * are:
 * 
 * - `https://github.com` allow only https scheme for this host
 * - `http://github.com` allow only http scheme for this host
 * - `github.com` allow any scheme for this host
 * - `*.github.com` allow any sub-domain including second-level domain itself
 * - `https://*.github.com` same as above but restrict for https only
 * - `github.com:*` allow any port for this host
 * - `*.github.com:*` allow any port for this host and any sub-domain
 * - `https://*.github.com:*` same as above but restrict for https only
 * 
 * Some browsers, like Chrome, won't check `Access-Control-Allow-Methods` and 
 * `Access-Control-Allow-Headers`, or check weakly, but using this module,
 * methods and headers are always strictly checked.
 * 
 * When Access Control Checking failed, or the request method is `OPTIONS` 
 * (whatever succeeded or failed), the connection should be immediately 
 * terminated and no more actions will run after that.
 * 
 * @param {any} options Could be an `*`, `true` to accept all origins, a 
 *  hostname to accept one origin, an array to accept several origins, or an 
 *  object contains: 
 *  `{ origins, methods, headers, credentials, maxAge, exposeHeaders }`.
 * @param {IncomingMessage} req
 * @param {ServerResponse} res 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 * @return {boolean} `true` for pass, `false` otherwise.
 */
function cors(options, req, res) {
    if (!req.protocol) {
        req.protocol = req.socket.encrypted ? "https" : "http";
    }

    let host = req.protocol + "://" + req.headers.host;
    
    if (req.headers.origin && req.headers.origin != host) { // Indicates CORS
        if (typeof options !== "object" || options instanceof Array) {
            options = { origins: options };
        }
        
        options = Object.assign({
            origins: null,
            methods: null,
            headers: null,
            credentials: true,
            maxAge: null,
            exposeHeaders: null
        }, options);

        if (!options.origins) { // No origins accepted, disable CORS.
            return false;
        } else if (options.origins === "*" || options.origins === true) {
            options.origins = [req.headers.origin];
        } else if (typeof options.origins === "string") {
            options.origins = [options.origins];
        }

        if (checkOrigins(req.headers.origin, options.origins)) {
            if (req.method === "OPTIONS") {
                var reqMethod = req.headers["access-control-request-method"],
                    reqHeaders = req.headers["access-control-request-headers"]
                        .split(",")
                        .map(v => {
                            return trimmer.trim(v).toLowerCase();
                        });

                // get accepted method
                if (!options.methods) {
                    options.methods = [reqMethod];
                } else if (typeof options.methods === "string") {
                    options.methods = options.methods.split(",").map(v => {
                        return trimmer.trim(v);
                    });
                }

                // get accepted headers
                if (!options.headers) {
                    options.headers = reqHeaders;
                } else if (typeof options.headers === "string") {
                    options.headers = options.headers.split(",").map(v => {
                        return trimmer.trim(v).toLowerCase();
                    });
                }

                res.setHeader("Access-Control-Allow-Methods", options.methods.join(", "));
                res.setHeader("Access-Control-Allow-Headers", options.headers.join(", "));

                // check method
                if (!options.methods.includes(reqMethod)) {
                    // res.setHeader("Access-Control-Allow-Origin", host);
                    return false;
                }

                // check headers
                for (let header of reqHeaders) {
                    if (!options.headers.includes(header)) {
                        // res.setHeader("Access-Control-Allow-Origin", host);
                        return false;
                    }
                }
            } else {
                if (options.credentials) {
                    res.setHeader("Access-Control-Allow-Credentials", "true");
                }
                if (options.maxAge) {
                    res.setHeader("Access-Control-Max-Age", options.maxAge);
                }
                if (options.exposeHeaders) {
                    if (options.exposeHeaders instanceof Array)
                        options.exposeHeaders = options.exposeHeaders.join(", ");
                    res.setHeader("Access-Control-Expose-Headers", options.exposeHeaders);
                }
            }
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        } else {
            // If origin isn't allowed, should fail the request immediately.
            return false;
        }
    }
    return true;
}

/** Middleware for Express framework. */
cors.express = (options) => {
    return (req, res, next) => {
        if (cors(options, req, res) && req.method != "OPTIONS") {
            next();
        } else {
            // Terminate the request. 
            res.end();
        }
    }
}

/** Middleware for Koa framework. */
cors.koa = (options) => {
    return (ctx, next) => {
        if (cors(options, ctx.req, ctx.res) && ctx.method != "OPTIONS") {
            next();
        } else {
            // Terminate the request. 
            ctx.status = 200;
            ctx.res.end();
        }
    }
}

function checkOrigins(origin, accepts) {
    // get origin info
    origin = url.parse(origin);
    if (!origin.port) {
        if (origin.protocol === "http:")
            origin.port = 80;
        else if (origin.protocol === "https:")
            origin.port = 443;
    }

    var pass = true;

    for (let host of accepts) {
        // check protocol
        let i = host.indexOf("://");
        if (i > 0) {
            let protocol = host.substring(0, i + 1);
            pass = protocol == origin.protocol;
            if (!pass)
                continue;
            else
                host = host.substring(i + 3);
        }

        // check port
        let j = host.indexOf(":");
        if (j > 0) {
            let port = host.substring(j + 1);
            pass = port == origin.port || port === "*";
            if (!pass)
                continue;
            else
                host = host.substring(0, j);
        }

        // check hostname
        if (host[0] === "*" && host[1] === ".") { // *.hostname.com style
            host = host.substring(2);
            pass = origin.hostname.lastIndexOf(host) === (origin.hostname.length - host.length);
        } else {
            pass = host == origin.hostname;
        }

    }

    return pass;
}

module.exports = cors;
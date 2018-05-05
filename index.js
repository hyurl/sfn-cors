var url = require("url");

/** Apply access control checking. */
function cors(options, req, res) {
    if (!req.protocol) {
        req.protocol = req.socket.encrypted ? "https" : "http";
    }

    var host = req.protocol + "://" + req.headers.host,
        isWildcard = false;

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
            // options.origins = [req.headers.origin];
            isWildcard = true;
        } else if (typeof options.origins === "string") {
            options.origins = [options.origins];
        }

        if (isWildcard || checkOrigins(req.headers.origin, options.origins)) {
            if (req.method === "OPTIONS") {
                var methods = [],
                    headers = [],
                    reqMethod = req.headers["access-control-request-method"],
                    reqHeaders = req.headers["access-control-request-headers"].split(/,\s*/);

                // get accepted method
                if (!options.methods) {
                    methods = [reqMethod];
                } else if (typeof options.methods === "string") {
                    methods = options.methods.split(/,\s*/);
                } else {
                    methods = options.methods;
                }

                // get accepted headers
                if (!options.headers) {
                    headers = reqHeaders;
                } else if (typeof options.headers === "string") {
                    headers = options.headers.split(/,\s*/);
                } else {
                    headers = options.headers;
                }

                res.setHeader("Access-Control-Allow-Methods", methods.join(", "));
                res.setHeader("Access-Control-Allow-Headers", headers.join(", "));

                // check method
                if (!methods.includes(reqMethod))
                    return false;

                // check headers
                for (var i in reqHeaders) {
                    if (!headers.includes(reqHeaders[i]))
                        return false;
                }
            } else {
                if (options.credentials)
                    res.setHeader("Access-Control-Allow-Credentials", "true");

                if (options.maxAge)
                    res.setHeader("Access-Control-Max-Age", options.maxAge);

                if (options.exposeHeaders) {
                    var headers = options.exposeHeaders instanceof Array
                        ? options.exposeHeaders.join(", ")
                        : options.exposeHeaders;

                    res.setHeader("Access-Control-Expose-Headers", headers);
                }
            }

            res.setHeader("Access-Control-Allow-Origin", isWildcard ? "*" : req.headers.origin);
        } else {
            // If origin isn't allowed, should fail the request immediately.
            return false;
        }
    }
    return true;
}

/** Middleware for Express framework. */
cors.express = function (options) {
    return function (req, res, next) {
        if (cors(options, req, res) && req.method != "OPTIONS") {
            next();
        } else {
            // Terminate the request. 
            res.end();
        }
    }
}

/** Middleware for Koa framework. */
cors.koa = function (options) {
    return function (ctx, next) {
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

    for (var x in accepts) {
        var host = accepts[x];

        // check protocol
        var i = host.indexOf("://");
        if (i > 0) {
            var protocol = host.substring(0, i + 1);
            pass = protocol == origin.protocol;
            if (!pass)
                continue;
            else
                host = host.substring(i + 3);
        }

        // check port
        var j = host.indexOf(":");
        if (j > 0) {
            var port = host.substring(j + 1);
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

        if (pass) break;

    }

    return pass;
}

module.exports = cors;
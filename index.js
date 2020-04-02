"use strict";

const url = require("url");

/** Apply access control checking. */
function cors(options, req, res) {
    if (!req.protocol) {
        req.protocol = req.socket.encrypted ? "https" : "http";
    }

    let host = req.protocol + "://" + req.headers.host;
    let isWildcard = false;

    if (req.headers.origin && req.headers.origin != host) { // Indicates CORS
        if (typeof options !== "object" || Array.isArray(options)) {
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
            isWildcard = true;
        } else if (typeof options.origins === "string") {
            options.origins = [options.origins];
        }

        if (isWildcard || checkOrigins(req.headers.origin, options.origins)) {
            if (req.method === "OPTIONS") {
                let methods = [];
                let headers = [];
                let reqMethod = req.headers["access-control-request-method"];
                let reqHeaders = req.headers["access-control-request-headers"]
                    ? String(req.headers["access-control-request-headers"]).split(/,\s*/)
                    : [];

                // get accepted method
                if (!options.methods) {
                    methods = reqMethod ? [reqMethod] : [];
                } else if (typeof options.methods === "string") {
                    methods = options.methods.split(/,\s*/);
                } else {
                    methods = options.methods;
                }

                // get accepted headers
                if (!options.headers) {
                    headers = reqHeaders || [];
                } else if (typeof options.headers === "string") {
                    headers = options.headers.split(/,\s*/);
                } else {
                    headers = options.headers;
                }

                res.setHeader("Access-Control-Allow-Methods", methods.join(", "));
                res.setHeader("Access-Control-Allow-Headers", headers.join(", "));

                // check method
                if (methods.indexOf(reqMethod) === -1)
                    return false;

                // check headers
                for (let header of reqHeaders) {
                    if (headers.indexOf(header) === -1)
                        return false;
                }
            } else {
                if (options.credentials)
                    res.setHeader("Access-Control-Allow-Credentials", "true");

                if (options.maxAge)
                    res.setHeader("Access-Control-Max-Age", options.maxAge);

                if (options.exposeHeaders) {
                    let headers = Array.isArray(options.exposeHeaders)
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

/**
 * @param {string} _origin 
 * @param {string[]} accepts 
 */
function checkOrigins(origin, accepts) {
    // get origin info
    let _origin = url.parse(origin);

    if (!_origin.port) {
        if (_origin.protocol === "http:")
            _origin.port = 80;
        else if (_origin.protocol === "https:")
            _origin.port = 443;
    }

    let pass = true;

    for (let host of accepts) {
        // check protocol
        let i = host.indexOf("://");

        if (i > 0) {
            let protocol = host.slice(0, i + 1);

            pass = protocol == _origin.protocol;

            if (!pass)
                continue;
            else
                host = host.substring(i + 3);
        }

        // check port
        let j = host.indexOf(":");

        if (j > 0) {
            let port = host.slice(j + 1);

            pass = port == _origin.port || port === "*";

            if (!pass)
                continue;
            else
                host = host.substring(0, j);
        }

        // check hostname
        if (host[0] === "*" && host[1] === ".") { // *.hostname.com style
            host = host.slice(2);
            pass = _origin.hostname.lastIndexOf(host) === (_origin.hostname.length - host.length);
        } else {
            pass = host == _origin.hostname;
        }

        if (pass)
            break;
    }

    return pass;
}

module.exports = cors;
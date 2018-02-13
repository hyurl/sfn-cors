import { IncomingMessage, ServerResponse } from "http";

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
 * @param options Could be an `*`, `true` to accept all origins, a hostname 
 *  to accept one origin, an array to accept several origins, or an object 
 *  contains: 
 *  `{ origins, methods, headers, credentials, maxAge, exposeHeaders }`.
 */
declare function cors(options: boolean | string | string[] | {
    origins: boolean | string | string[],
    methods?: string | string[],
    headers?: string | string[],
    credentials?: boolean,
    maxAge?: number,
    exposeHeaders?: string | string[]
}, req: IncomingMessage, res: ServerResponse): boolean;

declare namespace cors {
    export function express(options: boolean | string | string[] | {
        origins: boolean | string | string[],
        methods?: string | string[],
        headers?: string | string[],
        credentials?: boolean,
        maxAge?: number,
        exposeHeaders?: string | string[]
    }): (req: IncomingMessage, res: ServerResponse, next: Function) => void;

    export function koa(options: boolean | string | string[] | {
        origins: boolean | string | string[],
        methods?: string | string[],
        headers?: string | string[],
        credentials?: boolean,
        maxAge?: number,
        exposeHeaders?: string | string[]
    }): (ctx: any, next: Function) => void;
}

export = cors;
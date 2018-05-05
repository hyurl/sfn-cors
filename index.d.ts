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
 * - The port can be specified to an accurate port number.
 *
 * Some browsers, like Chrome, won't check `Access-Control-Allow-Methods` and
 * `Access-Control-Allow-Headers`, or check weakly, but using this module,
 * methods and headers are always strictly checked.
 *
 * When Access Control Checking failed, or the request method is `OPTIONS`
 * (whatever succeeded or failed), the connection should be immediately
 * terminated and no more actions will run after that.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 * @param allowAny Allow any origins, set `Access-Controll-Allow-Origin` to 
 *  `*`.
 */
declare function cors(allowAny: boolean, req: IncomingMessage, res: ServerResponse): boolean;

/**
 * @param origin Allow the origin that fulfills host specs.
 */
declare function cors(origin: string, req: IncomingMessage, res: ServerResponse): boolean;

/**
 * @param origin Allow several origins that fulfills host specs.
 */
declare function cors(origins: string[], req: IncomingMessage, res: ServerResponse): boolean;

/**
 * @param options An object contains 
 *  `{ origins, methods, headers, credentials, maxAge, exposeHeaders }`.
 */
declare function cors(options: cors.CorsOption, req: IncomingMessage, res: ServerResponse): boolean;

declare namespace cors {
    export interface CorsOption {
        /**
         * Set `true` to accept all origins, `false` to reject all.
         * Or set an origin or several origins that fulfills host specs.
         * */
        origins: boolean | string | string[],
        /** Sets `Access-Control-Allow-Methods`. */
        methods?: string | string[],
        /** Sets `Access-Control-Allow-Headers`. */
        headers?: string | string[],
        /** Sets `Access-Control-Allow-Credentials`. */
        credentials?: boolean,
        /** Sets `Access-Control-Max-Age` in seconds. */
        maxAge?: number,
        /** Sets `Access-Control-Expose-Headers`. */
        exposeHeaders?: string | string[]
    }

    /** Middleware for Express framework. */
    export function express(allowAny: boolean): (req: IncomingMessage, res: ServerResponse, next: Function) => void;
    export function express(origin: string): (req: IncomingMessage, res: ServerResponse, next: Function) => void;
    export function express(origins: string[]): (req: IncomingMessage, res: ServerResponse, next: Function) => void;
    export function express(options: CorsOption): (req: IncomingMessage, res: ServerResponse, next: Function) => void;

    /** Middleware for Koa framework. */
    export function koa(allowAny: boolean): (ctx: any, next: Function) => void;
    export function koa(origin: string): (ctx: any, next: Function) => void;
    export function koa(origins: string[]): (ctx: any, next: Function) => void;
    export function koa(options: CorsOption): (ctx: any, next: Function) => void;
}

export = cors;
global.Promise = require("bluebird");
var http = require("http");
var assert = require("assert");
var axios = require("axios").default;
var cors = require("./");

describe("cors(allowAll: boolean)", function () {
    it("should allow any origins", function (done) {
        var server = http.createServer(function (req, res) {
            if (cors(true, req, res)) {
                res.end("OK");
            } else {
                res.end();
            }
        });

        server.listen(3000, function () {
            axios.get("http://localhost:3000/", {
                headers: {
                    origin: "http://github.com"
                }
            }).then(function (res) {
                assert.equal(res.data, "OK");
                assert.equal(res.headers["access-control-allow-origin"], "*");
                assert.equal(res.headers["access-control-allow-credentials"], "true");

                return axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "http://google.com"
                    },
                    withCredentials: true
                });
            }).then(function (res) {
                assert.equal(res.data, "OK");
                assert.equal(res.headers["access-control-allow-origin"], "*");
                assert.equal(res.headers["access-control-allow-credentials"], "true");
            }).then(function () {
                server.close();
                done();
            }).catch(function (err) {
                server.close();
                done(err);
            });
        });
    });
});

describe("cors(origin: string)", function () {
    describe("cors('github.com')", function () {
        it("should allow origins that fulfill github.com", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("*.github.com", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "http://github.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "http://github.com");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://google.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('*.github.com')", function () {
        it("should allow origins that fulfill *.github.com", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("*.github.com", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "http://github.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "http://github.com");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://google.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('http://*.github.com')", function () {
        it("should allow origins that fulfill http://*.github.com", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("http://*.github.com", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "http://github.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "http://github.com");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://google.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('https://*.github.com')", function () {
        it("should allow origins that fulfill https://*.github.com", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("https://*.github.com", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://github.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "https://github.com");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://github.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('github.com:3000')", function () {
        it("should allow origins that fulfill github.com:3000", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("github.com:3000", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://github.com:3000"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "https://github.com:3000");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://github.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('*.github.com:3000')", function () {
        it("should allow origins that fulfill *.github.com:3000", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("*.github.com:3000", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://github.com:3000"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "https://github.com:3000");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://github.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('http://*.github.com:3000')", function () {
        it("should allow origins that fulfill http://*.github.com:3000", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("http://*.github.com:3000", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "http://github.com:3000"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "http://github.com:3000");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://github.com"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('https://*.github.com:3000')", function () {
        it("should allow origins that fulfill https://*.github.com:3000", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("https://*.github.com:3000", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://github.com:3000"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "https://github.com:3000");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "http://github.com:3000"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-credentials"], undefined);
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });

    describe("cors('github.com:*')", function () {
        it("should allow origins that fulfill github.com:*", function (done) {
            var server = http.createServer(function (req, res) {
                if (cors("github.com:*", req, res)) {
                    res.end("OK");
                } else {
                    res.end();
                }
            });

            server.listen(3000, function () {
                axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://github.com:3000"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "https://github.com:3000");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");

                    return axios.get("http://localhost:3000/", {
                        headers: {
                            origin: "https://github.com:443"
                        },
                        withCredentials: true
                    });
                }).then(function (res) {
                    assert.equal(res.data, "OK");
                    assert.equal(res.headers["access-control-allow-origin"], "https://github.com:443");
                    assert.equal(res.headers["access-control-allow-credentials"], "true");
                }).then(function () {
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
        });
    });
});

describe("cors(origins: string[])", function () {
    it("should allow origins that fulfill [ 'github.com', 'google.com' ]", function (done) {
        var server = http.createServer(function (req, res) {
            if (cors(["github.com", "google.com"], req, res)) {
                res.end("OK");
            } else {
                res.end();
            }
        });

        server.listen(3000, function () {
            axios.get("http://localhost:3000/", {
                headers: {
                    origin: "https://github.com"
                }
            }).then(function (res) {
                assert.equal(res.data, "OK");
                assert.equal(res.headers["access-control-allow-origin"], "https://github.com");
                assert.equal(res.headers["access-control-allow-credentials"], "true");

                return axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://google.com"
                    },
                    withCredentials: true
                });
            }).then(function (res) {
                assert.equal(res.data, "OK");
                assert.equal(res.headers["access-control-allow-origin"], "https://google.com");
                assert.equal(res.headers["access-control-allow-credentials"], "true");

                return axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://google.cn"
                    },
                    withCredentials: true
                });
            }).then(function (res) {
                assert.equal(res.data, "");
                assert.equal(res.headers["access-control-allow-origin"], undefined);
                assert.equal(res.headers["access-control-allow-credentials"], undefined);
            }).then(function () {
                server.close();
                done();
            }).catch(function (err) {
                server.close();
                done(err);
            });
        });
    });
});

describe("cors(options: CorsOption)", function () {
    it("should allow origins that fulfill the options", function (done) {
        var server = http.createServer(function (req, res) {
            if (cors({
                origins: ["github.com", "google.com"],
                methods: ["GET", "POST"],
                headers: ["X-Requested-With", "X-CSRF-Token"],
                maxAge: 86400,
                credentials: false,
                exposeHeaders: ["X-Powered-By", "Server"]
            }, req, res)) {
                if (req.method != "OPTIONS") {
                    res.end("OK");
                } else {
                    res.end();
                }
            } else {
                res.end();
            }
        });

        server.listen(3000, function () {
            axios.get("http://localhost:3000/", {
                headers: {
                    origin: "https://github.com"
                }
            }).then(function (res) {
                assert.equal(res.data, "OK");
                assert.equal(res.headers["access-control-allow-origin"], "https://github.com");
                assert.equal(res.headers["access-control-allow-credentials"], undefined);
                assert.equal(res.headers["access-control-expose-headers"], "X-Powered-By, Server");

                return axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://google.com"
                    },
                    withCredentials: true
                });
            }).then(function (res) {
                assert.equal(res.data, "OK");
                assert.equal(res.headers["access-control-allow-origin"], "https://google.com");
                assert.equal(res.headers["access-control-allow-credentials"], undefined);
                assert.equal(res.headers["access-control-expose-headers"], "X-Powered-By, Server");

                return axios.get("http://localhost:3000/", {
                    headers: {
                        origin: "https://google.cn"
                    },
                    withCredentials: true
                });
            }).then(function (res) {
                assert.equal(res.data, "");
                assert.equal(res.headers["access-control-allow-origin"], undefined);
                assert.equal(res.headers["access-control-allow-credentials"], undefined);
                assert.equal(res.headers["access-control-expose-headers"], undefined);

                return axios({
                    method: "OPTIONS",
                    url: "http://localhost:3000/",
                    headers: {
                        "Access-Control-Request-Method": "POST",
                        "Access-Control-Request-Headers": "X-Requested-With, X-CSRF-Token",
                        origin: "https://google.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], "https://google.com");
                    assert.equal(res.headers["access-control-allow-methods"], "GET, POST");
                    assert.equal(res.headers["access-control-allow-headers"], "X-Requested-With, X-CSRF-Token");
                });
            }).then(function () {
                return axios({
                    method: "OPTIONS",
                    url: "http://localhost:3000/",
                    headers: {
                        "Access-Control-Request-Method": "PATCH",
                        "Access-Control-Request-Headers": "X-Requested-With, X-CSRF-Token",
                        origin: "https://google.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-methods"], "GET, POST");
                    assert.equal(res.headers["access-control-allow-headers"], "X-Requested-With, X-CSRF-Token");
                });
            }).then(function () {
                return axios({
                    method: "OPTIONS",
                    url: "http://localhost:3000/",
                    headers: {
                        "Access-Control-Request-Method": "POST",
                        "Access-Control-Request-Headers": "X-Requested-With, X-CSRF-Token, X-My-Header",
                        origin: "https://google.com"
                    }
                }).then(function (res) {
                    assert.equal(res.data, "");
                    assert.equal(res.headers["access-control-allow-origin"], undefined);
                    assert.equal(res.headers["access-control-allow-methods"], "GET, POST");
                    assert.equal(res.headers["access-control-allow-headers"], "X-Requested-With, X-CSRF-Token");
                });
            }).then(function () {
                server.close();
                done();
            }).catch(function (err) {
                server.close();
                done(err);
            });
        });
    });
});
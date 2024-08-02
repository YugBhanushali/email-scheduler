"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const securitySetup = (app) => {
    // Disable 'X-Powered-By' header for security
    app.disable("x-powered-by");
    // Use Helmet to secure the app by setting various HTTP headers
    app.use((0, helmet_1.default)());
    // Use compression to decrease the size of the response body and increase the speed of web apps
    app.use((0, compression_1.default)());
    // Setup CORS - this allows or restricts requested resources on a web server based on where the HTTP request was initiated
    app.use((0, cors_1.default)({
        origin: "*",
        //   credentials: true,
    }));
    // Limit repeated requests to public APIs and/or endpoints
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10000, // limit each IP to 100 requests per windowMs
    }));
    // Protect against HTTP Parameter Pollution attacks
    app.use((0, hpp_1.default)());
    // Support parsing of application/json type post data
    app.use(express_1.default.json());
    // Middleware for parsing cookies
    app.use((0, cookie_parser_1.default)());
    // Middleware for handling multipart/form-data, which is primarily used for uploading files
    //   app.use(fileUpload());
};
exports.default = securitySetup;

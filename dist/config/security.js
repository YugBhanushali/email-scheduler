"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const securitySetup = (app) => {
    app.disable("x-powered-by");
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: "*",
        //   credentials: true,
    }));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10000, // limit each IP to 100 requests per windowMs
    }));
    app.use((0, hpp_1.default)());
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_fileupload_1.default)());
};
exports.default = securitySetup;

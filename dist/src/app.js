"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev")); // for logging
// Routes
app.use("/api/", emailRoutes_1.default);
app.get("/", (req, res) => {
    return res.send("Hello from server");
});
// Error Handling Middleware
app.use(errorHandler_1.default);
exports.default = app;

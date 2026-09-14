"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use((0, cors_1.default)({
    origin: config_1.default.cors_origins
        ? config_1.default.cors_origins.split(",").map((origin) => origin.trim())
        : [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://10.10.28.72:3000",
            "http://10.10.28.72:3001",
        ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.get("/", (req, res) => {
    res.send(`Coffee Membership Backend server is running !`);
});
//custom middleware implementation
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
//application routes
app.use("/api/v1", routes_1.default);
// Global Error-handling middleware
app.use(globalErrorHandler_1.default);
//route not found
app.use(notFound_1.default);
exports.default = app;

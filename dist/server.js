"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const dbConnect_1 = __importDefault(require("./utils/dbConnect"));
const promises_1 = __importDefault(require("node:dns/promises"));
const config_1 = __importDefault(require("./config"));
if (config_1.default.node_env !== "production") {
    promises_1.default.setServers(["1.1.1.1"]);
}
const server = http_1.default.createServer(app_1.default);
const port = config_1.default.port || 5050;
async function main() {
    try {
        await (0, dbConnect_1.default)();
        if (config_1.default.node_env !== "production") {
            server.listen(port, () => {
                console.log(`Coffee Membership Backend listening on port http://localhost:${port}`);
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}
main();
//asynchronous code error
process.on("unhandledRejection", (err) => {
    console.log(`❤❤ unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//synchronous code error--process immediately off
process.on("uncaughtException", (err) => {
    console.log(`😛😛 uncaughtException is detected , shutting down ...`, err);
    process.exit(1);
});
exports.default = app_1.default;

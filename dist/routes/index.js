"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const owner_route_1 = __importDefault(require("../modules/owner/owner.route"));
const shop_route_1 = __importDefault(require("../modules/shop/shop.route"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/owner",
        route: owner_route_1.default,
    },
    {
        path: "/shop",
        route: shop_route_1.default,
    },
];
moduleRoutes.forEach((item, i) => router.use(item.path, item.route));
exports.default = router;

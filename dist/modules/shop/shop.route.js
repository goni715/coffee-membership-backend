"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const user_constant_1 = require("../user/user.constant");
const shop_controller_1 = __importDefault(require("./shop.controller"));
const shop_validation_1 = require("./shop.validation");
const upload_1 = __importDefault(require("../../helpers/upload"));
const router = express_1.default.Router();
router.post("/create-shop", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.OWNER), upload_1.default.single("image"), (0, validationMiddleware_1.default)(shop_validation_1.createShopValidationSchema), shop_controller_1.default.createShop);
router.get("/get-shops", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.SUPER_ADMIN, user_constant_1.USER_ROLES.ADMIN), shop_controller_1.default.getShops);
router.get("/my-shop", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.OWNER), shop_controller_1.default.getMyShop);
router.patch("/update-shop", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.OWNER), upload_1.default.single("image"), (0, validationMiddleware_1.default)(shop_validation_1.updateShopValidationSchema), shop_controller_1.default.updateShop);
const ShopRoutes = router;
exports.default = ShopRoutes;

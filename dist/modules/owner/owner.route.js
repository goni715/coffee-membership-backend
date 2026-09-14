"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const owner_controller_1 = __importDefault(require("./owner.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const owner_validation_1 = require("./owner.validation");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post("/create-owner", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.SUPER_ADMIN, user_constant_1.USER_ROLES.ADMIN), (0, validationMiddleware_1.default)(owner_validation_1.createOwnerValidationSchema), owner_controller_1.default.createOwner);
router.get("/get-owners", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.SUPER_ADMIN, user_constant_1.USER_ROLES.ADMIN), owner_controller_1.default.getOwners);
router.patch("/update-owner/:ownerId", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.SUPER_ADMIN, user_constant_1.USER_ROLES.ADMIN), (0, validationMiddleware_1.default)(owner_validation_1.updateOwnerValidationSchema), owner_controller_1.default.updateOwner);
router.delete("/delete-owner/:ownerId", (0, authMiddleware_1.default)(user_constant_1.USER_ROLES.SUPER_ADMIN, user_constant_1.USER_ROLES.ADMIN), (0, validationMiddleware_1.default)(owner_validation_1.deleteOwnerValidationSchema), owner_controller_1.default.deleteOwner);
const OwnerRoutes = router;
exports.default = OwnerRoutes;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:dns/promises"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const dbConnect_1 = __importDefault(require("../utils/dbConnect"));
const user_constant_1 = require("../modules/user/user.constant");
const user_model_1 = __importDefault(require("../modules/user/user.model"));
promises_1.default.setServers(["1.1.1.1"]);
const seedSuperAdmin = async () => {
    try {
        await (0, dbConnect_1.default)();
        // Check if super admin already exists
        const isSuperAdminExists = await user_model_1.default.findOne({
            role: user_constant_1.USER_ROLES.SUPER_ADMIN,
        });
        if (isSuperAdminExists) {
            console.log("ℹ️ Super Admin already exists. No action needed.");
            return;
        }
        const superAdmin = {
            fullName: "Super Admin",
            email: config_1.default.admin.super_admin_email,
            password: config_1.default.admin.super_admin_password,
            phone: config_1.default.admin.super_admin_phone_number,
            role: user_constant_1.USER_ROLES.SUPER_ADMIN,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            status: user_constant_1.ACCOUNT_STATUSES.ACTIVE,
        };
        // Create super admin
        await user_model_1.default.create(superAdmin);
        console.log("✅ Super Admin created successfully.");
    }
    catch (err) {
        console.error("❌ Error seeding super admin:", err);
    }
    finally {
        await mongoose_1.default.connection.close();
        process.exit(0);
    }
};
seedSuperAdmin();

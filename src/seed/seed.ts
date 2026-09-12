import dns from "node:dns/promises";
import mongoose from "mongoose";
import config from "@/config";
import dbConnect from "@/utils/dbConnect";
import { USER_ROLES, ACCOUNT_STATUSES } from "@/modules/user/user.constant";
import UserModel from "@/modules/user/user.model";

dns.setServers(["1.1.1.1"]);

const seedSuperAdmin = async () => {
  try {
    await dbConnect();

    // Check if super admin already exists
    const isSuperAdminExists = await UserModel.findOne({
      role: USER_ROLES.SUPER_ADMIN,
    });

    if (isSuperAdminExists) {
      console.log("ℹ️ Super Admin already exists. No action needed.");
      return;
    }

    const superAdmin = {
      fullName: "Super Admin",
      email: config.admin.super_admin_email,
      password: config.admin.super_admin_password,
      phone: config.admin.super_admin_phone_number,
      role: USER_ROLES.SUPER_ADMIN,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      status: ACCOUNT_STATUSES.ACTIVE,
    };

    // Create super admin
    await UserModel.create(superAdmin);
    console.log("✅ Super Admin created successfully.");
  } catch (err) {
    console.error("❌ Error seeding super admin:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedSuperAdmin();


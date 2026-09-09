import config from "@/config";
import { USER_ROLES, ACCOUNT_STATUSES } from "@/modules/user/user.constant";
import UserModel from "@/modules/user/user.model";

const seedSuperAdmin = async () => {
  const superAdmin = {
    fullName: "Super Admin",
    email: config.admin.super_admin_email as string,
    password: config.admin.super_admin_password as string,
    role: USER_ROLES.SUPER_ADMIN,
    isVerified: true,
    status: ACCOUNT_STATUSES.ACTIVE,
  };
  //when databse is connected, we will check is there any user who is super admin
  const isSuperAdminExists = await UserModel.findOne({
    role: USER_ROLES.SUPER_ADMIN,
  });
  if (isSuperAdminExists) return;

  try {
    //create superadmin
    await UserModel.create(superAdmin);
    console.log("Super Admin Created");
  } catch (err: any) {
    throw err;
  }
};

seedSuperAdmin();

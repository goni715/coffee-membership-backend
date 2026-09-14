import express from "express";
import UserRoutes from "@/modules/user/user.route";
import AuthRoutes from "@/modules/auth/auth.route";
import OwnerRoutes from "@/modules/owner/owner.route";
import ShopRoutes from "@/modules/shop/shop.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/owner",
    route: OwnerRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
];

moduleRoutes.forEach((item, i) => router.use(item.path, item.route));

export default router;

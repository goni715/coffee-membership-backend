import express from "express";
import validationMiddleware from "@/middlewares/validationMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";
import ShopController from "./shop.controller";
import { createShopValidationSchema, updateShopValidationSchema } from "./shop.validation";
import upload from "@/helpers/upload";

const router = express.Router();

router.post(
  "/create-shop",
  authMiddleware(USER_ROLES.OWNER),
  upload.single("image"),
  validationMiddleware(createShopValidationSchema),
  ShopController.createShop,
);

router.get(
  "/get-shops",
  authMiddleware(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  ShopController.getShops,
);

router.get(
  "/my-shop",
  authMiddleware(USER_ROLES.OWNER),
  ShopController.getMyShop,
);

router.patch(
  "/update-shop",
  authMiddleware(USER_ROLES.OWNER),
  upload.single("image"),
  validationMiddleware(updateShopValidationSchema),
  ShopController.updateShop,
);

const ShopRoutes = router;
export default ShopRoutes;

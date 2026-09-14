import express from "express";
import validationMiddleware from "@/middlewares/validationMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";
import ShopController from "./shop.controller";
import { createShopValidationSchema } from "./shop.validation";

const router = express.Router();

router.post(
    "/create-shop",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(createShopValidationSchema),
    ShopController.createShop,
);


const ShopRoutes = router;
export default ShopRoutes;

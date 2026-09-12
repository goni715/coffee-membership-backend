import express from "express";
import OwnerController from "./owner.controller";
import validationMiddleware from "@/middlewares/validationMiddleware";
import { createOwnerValidationSchema } from "./owner.validation";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";

const router = express.Router();

router.post(
  "/create-owner",
  authMiddleware(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationMiddleware(createOwnerValidationSchema),
  OwnerController.createOwner,
);

router.get(
  "/get-owners",
  authMiddleware(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  OwnerController.getOwners,
);

const OwnerRoutes = router;
export default OwnerRoutes;

import express from "express";
import validationMiddleware from "@/middlewares/validationMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";
import { createOpeningHourValidationSchema, updateOpeningHourValidationSchema } from "./openingHour.validation";
import OpeningHourController from "./openingHour.controller";

const router = express.Router();

router.post(
    "/create-opening-hour",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(createOpeningHourValidationSchema),
    OpeningHourController.createOpeningHour,
);

router.patch(
    "/update-opening-hour/:openingId",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(updateOpeningHourValidationSchema),
    OpeningHourController.updateOpeningHour,
);


const OpeningHourRoutes = router;
export default OpeningHourRoutes;

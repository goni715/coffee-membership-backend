import express from "express";
import validationMiddleware from "@/middlewares/validationMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";
import { createOpeningHourValidationSchema, deleteOpeningHourValidationSchema, updateOpeningHourValidationSchema } from "./openingHour.validation";
import OpeningHourController from "./openingHour.controller";

const router = express.Router();

router.post(
    "/create-opening-hour",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(createOpeningHourValidationSchema),
    OpeningHourController.createOpeningHour,
);

router.get(
    "/opening-hours",
    authMiddleware(USER_ROLES.OWNER),
    OpeningHourController.getOpeningHours,
);

router.patch(
    "/update-opening-hour/:openingId",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(updateOpeningHourValidationSchema),
    OpeningHourController.updateOpeningHour,
);

router.delete(
    "/delete-opening-hour/:openingId",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(deleteOpeningHourValidationSchema),
    OpeningHourController.deleteOpeningHour,
);


const OpeningHourRoutes = router;
export default OpeningHourRoutes;

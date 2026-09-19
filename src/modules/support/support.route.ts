import express from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import SupportController from "./support.controller";
import { supportValidationSchema } from "./support.validation";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "../user/user.constant";
;

const router = express.Router();


router.post(
    "/submit",
    authMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.OWNER),
    validationMiddleware(supportValidationSchema),
    SupportController.submitSupportRequest
);

const SupportRoutes = router;
export default SupportRoutes;
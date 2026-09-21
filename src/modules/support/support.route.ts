import express from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import SupportController from "./support.controller";
import { getAllSupportsValidationSchema, supportValidationSchema } from "./support.validation";
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

router.get(
    "/all-supports",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(getAllSupportsValidationSchema),
    SupportController.getSupports
);
const SupportRoutes = router;
export default SupportRoutes;
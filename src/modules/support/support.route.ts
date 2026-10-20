import express from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import SupportController from "./support.controller";
import { closeSupportValidationSchema, getAllSupportsValidationSchema, replySupportValidationSchema, supportValidationSchema } from "./support.validation";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "../user/user.constant";


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

router.patch(
    "/reply/:supportId",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(replySupportValidationSchema),
    SupportController.replySupport
);

router.patch(
    "/close/:supportId",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(closeSupportValidationSchema),
    SupportController.closeSupport
);

router.delete(
    "/delete/:supportId",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(closeSupportValidationSchema),
    SupportController.deleteSupport
);

const SupportRoutes = router;
export default SupportRoutes;
import express from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import { USER_ROLES } from '../user/user.constant';
import validationMiddleware from '@/middlewares/validationMiddleware';
import { generateQrCodeValidationSchema, getRedemptionsValidationSchema, verifyQrCodeValidationSchema } from './redemption.validation';
import RedemptionController from './redemption.controller';

const router = express.Router();

router.post(
    '/generate-qr-code',
    authMiddleware(USER_ROLES.CUSTOMER),
    validationMiddleware(generateQrCodeValidationSchema),
    RedemptionController.generateRedemptionQrCode,
);

router.get(
    '/owner-redemptions',
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(getRedemptionsValidationSchema),
    RedemptionController.getOwnerRedemptions,
);

router.get(
    '/customer-redemptions',
    authMiddleware(USER_ROLES.CUSTOMER),
    validationMiddleware(getRedemptionsValidationSchema),
    RedemptionController.getCustomerRedemptions,
);

router.post(
    '/verify-qr-code',
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(verifyQrCodeValidationSchema),
    RedemptionController.verifyQrCode,
);


const RedemptionRoutes = router;
export default RedemptionRoutes;
import express from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import { USER_ROLES } from '../user/user.constant';
import validationMiddleware from '@/middlewares/validationMiddleware';
import MembershipController from './membership.controller';
import { getSingleMembershipByShopIdValidationSchema, getSingleRequestValidationSchema, joinShopValidationSchema, updateMembershipStatusValidationSchema } from './membership.validation';

const router = express.Router();

router.post(
    '/join-shop',
    authMiddleware(USER_ROLES.CUSTOMER),
    validationMiddleware(joinShopValidationSchema),
    MembershipController.joinShop,
);

router.get(
    '/requests',
    authMiddleware(USER_ROLES.OWNER),
    MembershipController.getMembershipRequests,
);

router.get(
    '/single-request/:membershipId',
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(getSingleRequestValidationSchema),
    MembershipController.getSingleRequest,
);

router.patch(
    '/update-status/:membershipId',
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(updateMembershipStatusValidationSchema),
    MembershipController.updateMembershipStatus,
);

router.get(
    '/my-memberships',
    authMiddleware(USER_ROLES.CUSTOMER),
    MembershipController.getMyMemberships,
);

router.get(
    '/single-membership/:shopId',
    authMiddleware(USER_ROLES.CUSTOMER),
    validationMiddleware(getSingleMembershipByShopIdValidationSchema),
    MembershipController.getSingleMembershipByShopId,
);

const MembershipRoutes = router;
export default MembershipRoutes;
import express from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import { USER_ROLES } from '../user/user.constant';
import validationMiddleware from '@/middlewares/validationMiddleware';
import MembershipController from './membership.controller';
import { joinShopValidationSchema } from './membership.validation';

const router = express.Router();

router.post(
    '/join-shop',
    authMiddleware(USER_ROLES.CUSTOMER),
    validationMiddleware(joinShopValidationSchema),
    MembershipController.joinShop,
);



const MembershipRoutes = router;
export default MembershipRoutes;
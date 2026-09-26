import express from 'express';
import DashboardController from './dashboard.controller';
import authMiddleware from '@/middlewares/authMiddleware';
import { USER_ROLES } from '../user/user.constant';


const router = express.Router();


router.get(
    '/stats',
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    DashboardController.getStats,
);

router.get(
    '/owner-stats',
    authMiddleware(USER_ROLES.OWNER),
    DashboardController.getOwnerStats,
);


const DashboardRoutes = router;
export default DashboardRoutes;
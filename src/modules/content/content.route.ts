import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import ContentController from './content.controller';
import authMiddleware from '@/middlewares/authMiddleware';
import { USER_ROLES } from '../user/user.constant';
import { contentValidationSchema, getContentValidationSchema } from './content.validation';

const router = express.Router();

router.patch(
    '/create-update',
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(contentValidationSchema),
    ContentController.createUpdateContent,
);

router.get(
    '/content-by-type/:type',
    authMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.OWNER),
    validationMiddleware(getContentValidationSchema),
    ContentController.getContentByType,
);


const ContentRoutes = router;
export default ContentRoutes;